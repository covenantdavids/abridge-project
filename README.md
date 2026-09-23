# Abridge

Abridge is a React/Vite + Supabase product-promotion app.

## Run locally

1. Install Node.js 20+.
2. Copy `.env.example` to `.env.local`.
3. Put your Supabase project URL and anon/publishable key in `.env.local`.
4. In Supabase SQL Editor, run `supabase/schema.sql`.
5. In Supabase Auth settings, disable **Confirm email** because the requested flow logs users in immediately after signup.
6. Run:

```bash
npm install
npm run dev
```

## Admin

Create your account normally. After login, in Supabase Table Editor set that row's `is_admin` value to `true`. Then open `/admin`.

## Payment

The review page uses the configured Paystack payment link. Because the link does not identify the payer to the app, the admin manually matches payment in Paystack and clicks **Mark as paid and start**. That sets `status=running` and `started_at` to the current time.

## Unpaid campaign cleanup

Unpaid campaigns are intended to be deleted after 14 days. The SQL file includes the cleanup statement. For production, schedule it using Supabase Cron/pg_cron or another trusted scheduled job.

## Notes

- Campaign price is fixed at ₦2,000.
- Campaign duration is 5 days.
- The landing page avoids the unsupported 100K-user claim.
- The customer outcome language is intentionally non-guaranteed: “Reach 5–10 potential customers daily.”
- Product images accept any dimensions. The browser currently preserves the selected image; add an image-processing worker if server-side resizing/compression is required at scale.
