export const PRICE = 2000
export const DURATION_DAYS = 5
export const PAYMENT_URL = 'https://paystack.shop/pay/2ii5dsb98z'
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
export function daysRunning(startedAt){
  if(!startedAt) return 0
  return Math.min(DURATION_DAYS, Math.max(1, Math.ceil((Date.now()-new Date(startedAt).getTime())/86400000)))
}
export function daysLeft(startedAt){ return Math.max(0, DURATION_DAYS-daysRunning(startedAt)) }
export function derivedStatus(c){ if(c.status==='awaiting_payment') return 'awaiting_payment'; if(c.status==='running' && daysLeft(c.started_at)<=0) return 'completed'; return c.status }
