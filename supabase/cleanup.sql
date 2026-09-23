-- Optional scheduled cleanup for Supabase projects with pg_cron enabled.
-- Enable pg_cron in Supabase Dashboard > Database > Extensions first.
create or replace function public.delete_expired_unpaid_campaigns()
returns integer language plpgsql security definer set search_path=public as $$
declare deleted_count integer;
begin
  delete from public.campaigns
  where status='awaiting_payment'
    and created_at < now() - interval '14 days';
  get diagnostics deleted_count = row_count;
  return deleted_count;
end;
$$;

-- Then schedule once per day:
-- select cron.schedule('abridge-delete-expired-campaigns', '0 3 * * *', $$select public.delete_expired_unpaid_campaigns();$$);
