export const PRICE = 2000
export const DURATION_DAYS = 5
export const PAYMENT_URL = 'https://paystack.shop/pay/2ii5dsb98z'
export const PLANS = [
  { price: 500, days: 2, impressions: '100 - 1K', paymentUrl: 'https://paystack.shop/pay/hy2mcyosog' },
  { price: 1000, days: 3, impressions: '500 - 2.5K', paymentUrl: 'https://paystack.shop/pay/vq66fjhvc6' },
  { price: 2000, days: 5, impressions: '1K - 3K', paymentUrl: 'https://paystack.shop/pay/2ii5dsb98z' },
  { price: 3000, days: 7, impressions: '1.5K - 4.5K', paymentUrl: 'https://paystack.shop/pay/sg8ozboj4e' },
  { price: 4000, days: 10, impressions: '2.5K - 5K', paymentUrl: 'https://paystack.shop/pay/ltoe1tox9e' },
  { price: 5000, days: 15, impressions: '3K - 10K', paymentUrl: 'https://paystack.shop/pay/ldra0da8b1' },
]
export const categories = {
  'Digital Products':['Affiliate marketing','Templates & Tools','Software','Guides & Resources'],
  'Ebooks':['Business','Education','Self-improvement','Fiction'],
  'Courses & Memberships':['Online course','Membership','Coaching','Training'],
  'Event Tickets & Training':['Conference','Workshop','Webinar','Training'],
  'Services':['Consulting','Creative services','Professional services','Freelance'],
  'Physical Goods':['Fashion','Beauty','Food & Beverage','Other physical goods']
}
export function formatNaira(n){ return new Intl.NumberFormat('en-NG',{style:'currency',currency:'NGN',maximumFractionDigits:0}).format(n) }
export function titleCaseName(s=''){ return s ? s.charAt(0).toUpperCase()+s.slice(1).toLowerCase() : '' }
export function daysRunning(startedAt, duration=DURATION_DAYS){
  if(!startedAt) return 0
  return Math.min(duration, Math.max(1, Math.ceil((Date.now()-new Date(startedAt).getTime())/86400000)))
}
export function daysLeft(startedAt, duration=DURATION_DAYS){ return Math.max(0, duration-daysRunning(startedAt, duration)) }
export function derivedStatus(c){ if(c.status==='awaiting_payment') return 'awaiting_payment'; if(c.status==='running' && daysLeft(c.started_at, c.duration_days||DURATION_DAYS)<=0) return 'completed'; return c.status }