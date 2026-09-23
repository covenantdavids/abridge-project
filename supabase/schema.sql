-- Abridge Supabase setup
create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  first_name text not null default '',
  last_name text not null default '',
  email text not null default '',
  is_admin boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.campaigns (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  product_link text not null,
  image_path text,
  image_url text,
  category text not null,
  sub_category text not null,
  whatsapp_link text,
  receive_messages boolean not null default false,
  status text not null default 'awaiting_payment' check (status in ('awaiting_payment','running')),
  price integer not null default 2000,
  duration_days integer not null default 5,
  started_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists campaigns_user_id_idx on public.campaigns(user_id);
create index if not exists campaigns_status_idx on public.campaigns(status);

alter table public.profiles enable row level security;
alter table public.campaigns enable row level security;

create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path=public as $$
  select exists(select 1 from public.profiles where id=auth.uid() and is_admin=true);
$$;

create policy "profiles own read" on public.profiles for select using (id=auth.uid() or public.is_admin());
create policy "profiles own insert" on public.profiles for insert with check (id=auth.uid());
create policy "profiles own update" on public.profiles for update using (id=auth.uid() or public.is_admin()) with check (id=auth.uid() or public.is_admin());

create policy "campaigns own read" on public.campaigns for select using (user_id=auth.uid() or public.is_admin());
create policy "campaigns own insert" on public.campaigns for insert with check (user_id=auth.uid());
create policy "campaigns own update" on public.campaigns for update using (user_id=auth.uid() or public.is_admin()) with check (user_id=auth.uid() or public.is_admin());
create policy "campaigns own delete" on public.campaigns for delete using (user_id=auth.uid() or public.is_admin());

-- Profile creation trigger: no email verification is required by the application.
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path=public as $$
begin
  insert into public.profiles(id,first_name,last_name,email)
  values(new.id,coalesce(new.raw_user_meta_data->>'first_name',''),coalesce(new.raw_user_meta_data->>'last_name',''),coalesce(new.email,''))
  on conflict (id) do update set first_name=excluded.first_name,last_name=excluded.last_name,email=excluded.email;
  return new;
end;
$$;
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users for each row execute procedure public.handle_new_user();

insert into storage.buckets (id,name,public) values ('product-images','product-images',true) on conflict (id) do update set public=true;
create policy "public product image read" on storage.objects for select using (bucket_id='product-images');
create policy "users upload product images" on storage.objects for insert with check (bucket_id='product-images' and auth.uid()::text = (storage.foldername(name))[1]);
create policy "users delete product images" on storage.objects for delete using (bucket_id='product-images' and auth.uid()::text = (storage.foldername(name))[1]);

-- Run periodically (Supabase pg_cron if enabled) to remove unpaid campaigns older than 14 days:
-- delete from public.campaigns where status='awaiting_payment' and created_at < now() - interval '14 days';
