import ChatSupport from '../components/ChatSupport'
import NotificationBell from '../components/NotificationBell'
import React, { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { LayoutDashboard, BarChart3, Settings, MessageCircle, Plus, ShieldCheck, LogOut, Menu, Users, ChevronLeft, RotateCcw } from 'lucide-react'
import { supabase } from '../lib/supabase'; import CustomersChart from './CustomersChart'; import ProfileSettings from './ProfileSettings'
import { PAYMENT_URL, derivedStatus, titleCaseName } from '../lib/data'

const fallbackUserKey = 'abridge_demo_user'
const IMPRESSIONS = { facebook: 0, tiktok: 0, instagram: 0 }

const css = `
.nd{display:grid;grid-template-columns:250px 1fr;min-height:100vh;background:#fafbff;color:#1c2333;font-family:'DM Sans',system-ui,sans-serif}
.nd-side{background:#14201F;color:#fff;display:flex;flex-direction:column;position:sticky;top:0;height:100vh}
.nd-profile{padding:28px 20px 22px;text-align:center;border-bottom:1px solid rgba(255,255,255,.12)}
.nd-avatar{width:76px;height:76px;border-radius:50%;background:#B7F227;color:#14201F;display:flex;align-items:center;justify-content:center;font-weight:800;font-size:26px;margin:0 auto 12px}
.nd-profile strong{display:block;font-size:17px}
.nd-profile span{display:block;font-size:12px;opacity:.65;margin-top:3px;word-break:break-all}
.nd-nav{flex:1;padding:12px 0;overflow-y:auto}
.nd-item{display:flex;align-items:center;gap:14px;width:100%;box-sizing:border-box;padding:14px 22px;background:none;border:0;border-left:4px solid transparent;color:#fff;font:inherit;font-size:15px;cursor:pointer;text-align:left;text-decoration:none}
.nd-item:hover{background:rgba(255,255,255,.07)}
.nd-item.on{background:rgba(183,242,39,.14);border-left-color:#B7F227;color:#B7F227;font-weight:700}
.nd-main{min-width:0}
.nd-wrap{max-width:700px;margin:0 auto;padding:36px 32px 64px}
.nd-top{display:flex;align-items:flex-start;justify-content:space-between;gap:16px}
.nd-title{margin:0;font-size:30px;font-weight:800;line-height:1.2}
.nd-burger{display:none;background:none;border:0;cursor:pointer;color:#1c2333}
.nd-sub{margin:10px 0 0;color:#5b6385;font-size:15px}
.nd-bar{display:flex;align-items:flex-end;justify-content:space-between;gap:12px;margin-top:34px;position:relative}
.nd-h3{margin:0;font-size:18px;font-weight:700}
.nd-help{display:inline-flex;align-items:center;gap:6px;background:none;border:0;padding:4px 2px;font:inherit;font-size:15px;font-weight:700;cursor:pointer;color:#1c2333}
.nd-help:hover{text-decoration:underline}
.nd-help:focus-visible,.nd-link:focus-visible,.nd-row:focus-visible,.nd-item:focus-visible{outline:3px solid #B7F227;outline-offset:2px}
.nd-help-box{position:absolute;right:0;top:115%;z-index:5;width:min(340px,100%);background:#fff;border:1px solid #e4e7ef;border-radius:14px;padding:18px;box-shadow:0 14px 30px rgba(28,35,51,.15)}
.nd-help-box ol{margin:10px 0 12px;padding-left:18px;font-size:14px;line-height:1.6}
.nd-help-box a{display:block;padding:6px 0;font-weight:700;text-decoration:underline;color:#1c2333}
.nd-link{background:none;border:0;font:inherit;font-size:14px;color:#5b6385;cursor:pointer;text-decoration:underline;padding:0}
.nd-row{display:flex;align-items:center;gap:18px;width:100%;box-sizing:border-box;padding:30px 26px;margin-top:12px;background:#fff;border:1px solid #e8eaf0;border-radius:12px;font:inherit;color:inherit;text-decoration:none;cursor:pointer;text-align:left}
.nd-row:hover{border-color:#B7F227}
.nd-ic{display:flex;width:30px;justify-content:center;color:#c3c8d4}
.nd-label{flex:1;font-weight:700;font-size:18px;color:#5b6385}
.nd-val{font-size:22px;font-weight:500;color:#1c2333;text-decoration:underline}
.nd-cta{display:inline-flex;align-items:center;gap:8px;margin-top:22px;background:#B7F227;color:#14201F;border:0;border-radius:999px;padding:14px 24px;font:inherit;font-weight:700;font-size:16px;cursor:pointer}
.nd-btn{margin-top:16px;background:#14201F;color:#fff;border:0;border-radius:999px;padding:12px 22px;font:inherit;font-weight:700;cursor:pointer}
.nd-btn:disabled{opacity:.6;cursor:wait}
.nd-list{margin-top:34px}
.nd-list h2{margin:0 0 4px;font-size:18px}
.nd-camp{background:#fff;border:1px solid #e8eaf0;border-radius:12px;padding:16px 18px;margin-top:12px}
.nd-camp strong{display:block;word-break:break-all;font-size:15px}
.nd-camp small{color:#5b6385;font-size:13px}
.nd-acts{display:flex;gap:14px;align-items:center;margin-top:10px;font-size:14px}
.nd-acts a,.nd-acts button{font:inherit;font-weight:700;background:none;border:0;padding:0;cursor:pointer;text-decoration:underline;color:#1c2333}
.nd-acts .del{color:#c0392b}
.nd-empty{background:#fff;border:1px solid #e8eaf0;border-radius:12px;padding:56px 24px;text-align:center;margin-top:24px}
.nd-empty .ic{width:68px;height:68px;border-radius:50%;background:#f1f3f9;display:flex;align-items:center;justify-content:center;margin:0 auto 16px;color:#8a92ad}
.nd-empty h2{margin:0 0 6px;font-size:20px}
.nd-empty p{margin:0 auto;max-width:380px;color:#5b6385;font-size:14px;line-height:1.6}
.nd-panel{background:#fff;border:1px solid #e8eaf0;border-radius:12px;padding:22px;margin-top:18px}
.nd-panel h2{margin:0 0 4px;font-size:18px}
.nd-panel p{margin:0;color:#5b6385;font-size:14px;line-height:1.6}
.nd-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:14px;margin-top:14px}
.nd-lab{display:block;font-size:13px;font-weight:700;margin-bottom:6px}
.nd-input{width:100%;box-sizing:border-box;padding:12px 14px;border-radius:12px;border:1px solid #dce3d9;font:inherit;font-size:15px;background:#fff;color:#1c2333}
.nd-err{margin-top:12px;color:#c0392b;font-size:14px}
.nd-ok{margin-top:12px;color:#2f7d32;font-weight:700;font-size:14px}
.nd-scrim{display:none}
@media (min-width:0px){
.nd{grid-template-columns:1fr}
.nd-side{position:fixed;z-index:30;left:0;top:0;width:260px;transform:translateX(-100%);transition:transform .2s}
.nd-side.open{transform:none}
.nd-scrim.open{display:block;position:fixed;inset:0;background:rgba(20,32,31,.45);z-index:20}
.nd-burger{display:block}
.nd-wrap{padding:24px 16px 56px}
}
@media (prefers-reduced-motion:reduce){.nd-side{transition:none}}
`

const FbIcon = () => <svg width="28" height="28" viewBox="0 0 24 24" aria-hidden="true"><path fill="#1877F2" d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>
const TtIcon = () => <svg width="28" height="28" viewBox="0 0 24 24" aria-hidden="true"><path fill="#14201F" d="M16.6 5.8A4.3 4.3 0 0 1 15.5 3h-3.1v12.4a2.6 2.6 0 1 1-2.6-2.6c.3 0 .5 0 .8.1V9.7a5.7 5.7 0 1 0 4.9 5.7V9a7.3 7.3 0 0 0 4.2 1.3V7.2a4.3 4.3 0 0 1-3.1-1.4z" /></svg>
const IgIcon = () => <svg width="28" height="28" viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5" fill="none" stroke="#E4405F" strokeWidth="2" /><circle cx="12" cy="12" r="4" fill="none" stroke="#E4405F" strokeWidth="2" /><circle cx="17.5" cy="6.5" r="1.2" fill="#E4405F" /></svg>
const ClockIcon = () => <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#F28C38" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
const HelpIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10" /><path d="M9.1 9a3 3 0 0 1 5.8 1c0 2-3 3-3 3" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>

function Row({ icon, label, value, href, onClick }) {
  const inner = <><span className="nd-ic">{icon}</span><span className="nd-label">{label}</span><span className="nd-val">{value}</span></>
  return href
    ? <a className="nd-row" href={href} target="_blank" rel="noreferrer">{inner}</a>
    : <button type="button" className="nd-row" onClick={onClick}>{inner}</button>
}

function Empty({ Icon, title, text, action, onAction }) {
  return <div className="nd-empty">
    <div className="ic"><Icon size={28} /></div>
    <h2>{title}</h2>
    <p>{text}</p>
    {action && <button type="button" className="nd-cta" onClick={onAction}>{action} <Plus size={18} /></button>}
  </div>
}

function SettingsPanel({ user }) {
  const [first, setFirst] = useState(user?.user_metadata?.first_name || user?.first_name || '')
  const [last, setLast] = useState(user?.user_metadata?.last_name || user?.last_name || '')
  const [msg, setMsg] = useState('')
  const [err, setErr] = useState('')
  const [saving, setSaving] = useState(false)
  const [pw, setPw] = useState('')
  const [pw2, setPw2] = useState('')
  const [pwMsg, setPwMsg] = useState('')
  const [pwErr, setPwErr] = useState('')
  const [pwBusy, setPwBusy] = useState(false)

  async function saveProfile(e) {
    e.preventDefault(); setMsg(''); setErr('')
    if (!first.trim() || !last.trim()) { setErr('Enter your first and last name.'); return }
    setSaving(true)
    try {
      if (supabase) {
        const { error } = await supabase.auth.updateUser({ data: { first_name: first.trim(), last_name: last.trim() } })
        if (error) throw error
        const { error: e2 } = await supabase.from('profiles').update({ first_name: first.trim(), last_name: last.trim() }).eq('id', user.id)
        if (e2) throw e2
      } else {
        const raw = JSON.parse(localStorage.getItem(fallbackUserKey) || '{}')
        localStorage.setItem(fallbackUserKey, JSON.stringify({ ...raw, first_name: first.trim(), last_name: last.trim() }))
      }
      setMsg('Your details have been saved. Refresh the page to see your new name in the menu.')
    } catch (x) { setErr(x.message || 'Could not save your details.') } finally { setSaving(false) }
  }

  async function savePassword(e) {
    e.preventDefault(); setPwMsg(''); setPwErr('')
    if (pw.length < 8 || !/[A-Za-z]/.test(pw) || !/\d/.test(pw)) { setPwErr('Password must contain 8 characters, a letter and a number.'); return }
    if (pw !== pw2) { setPwErr('Passwords do not match.'); return }
    if (!supabase) { setPwErr('Changing your password needs your Supabase connection.'); return }
    setPwBusy(true)
    try {
      const { error } = await supabase.auth.updateUser({ password: pw })
      if (error) throw error
      setPw(''); setPw2(''); setPwMsg('Your password has been updated.')
    } catch (x) { setPwErr(x.message || 'Could not update your password.') } finally { setPwBusy(false) }
  }

  return <>
    <div className="nd-panel">
      <h2>Account details</h2>
      <p>Update the name on your account.</p>
      <form onSubmit={saveProfile}>
        <div className="nd-grid">
          <div><label className="nd-lab">First name</label><input className="nd-input" value={first} onChange={e => setFirst(e.target.value)} /></div>
          <div><label className="nd-lab">Last name</label><input className="nd-input" value={last} onChange={e => setLast(e.target.value)} /></div>
        </div>
        <div style={{ marginTop: 14 }}><label className="nd-lab">Email address</label><input className="nd-input" style={{ opacity: 0.6, cursor: 'not-allowed' }} value={user?.email || ''} disabled readOnly /></div>
        {err && <div className="nd-err">{err}</div>}
        {msg && <div className="nd-ok">{msg}</div>}
        <button className="nd-btn" disabled={saving}>{saving ? 'Saving…' : 'Save changes'}</button>
      </form>
    </div>
    <div className="nd-panel">
      <h2>Change password</h2>
      <p>Use at least 8 characters, with a letter and a number.</p>
      <form onSubmit={savePassword}>
        <div className="nd-grid">
          <div><label className="nd-lab">New password</label><input className="nd-input" type="password" value={pw} onChange={e => setPw(e.target.value)} /></div>
          <div><label className="nd-lab">Confirm new password</label><input className="nd-input" type="password" value={pw2} onChange={e => setPw2(e.target.value)} /></div>
        </div>
        {pwErr && <div className="nd-err">{pwErr}</div>}
        {pwMsg && <div className="nd-ok">{pwMsg}</div>}
        <button className="nd-btn" disabled={pwBusy}>{pwBusy ? 'Updating…' : 'Update password'}</button>
      </form>
    </div>
    <div className="nd-panel">
      <h2>Help and support</h2>
      <p>Need help with a campaign or a payment? Reach the Abridge team.</p>
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 16 }}>
        <a className="nd-btn" style={{ marginTop: 0, textDecoration: 'none' }} href="https://wa.me/234XXXXXXXXXX" target="_blank" rel="noreferrer">Chat on WhatsApp</a>
        <a className="nd-btn" style={{ marginTop: 0, textDecoration: 'none' }} href="mailto:abridgesupport@gmail.com">Email support</a>
      </div>
      <p style={{ marginTop: 16 }}><Link to="/terms" style={{ fontWeight: 700, textDecoration: 'underline', color: '#1c2333' }}>Terms of Service and Refund Policy</Link></p>
    </div>
  </>
}

export default function Dashboard() {
  const nav = useNavigate()
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [campaigns, setCampaigns] = useState([])
  const [busy, setBusy] = useState(true)
  const [help, setHelp] = useState(false)
  const [menu, setMenu] = useState(false)
  const [view, setView] = useState('home')

  useEffect(() => {
    if (!supabase) {
      const raw = localStorage.getItem(fallbackUserKey)
      setUser(raw ? JSON.parse(raw) : null)
      return
    }
    supabase.auth.getUser().then(({ data }) => setUser(data.user || null))
  }, [])

  useEffect(() => {
    if (!user) return
    async function load() {
      try {
        if (supabase) {
          const { data: p } = await supabase.from('profiles').select('*').eq('id', user.id).single()
          setProfile(p || {})
          const { data, error } = await supabase.from('campaigns').select('*').eq('user_id', user.id).order('created_at', { ascending: false })
          if (error) throw error
          setCampaigns(data || [])
        } else {
          setProfile(JSON.parse(localStorage.getItem(fallbackUserKey) || '{}'))
          setCampaigns(JSON.parse(localStorage.getItem('abridge_campaigns') || '[]').filter(c => c.user_id === user.id))
        }
      } catch (e) { console.error(e) } finally { setBusy(false) }
    }
    load()
  }, [user])

  async function del(id) {
    if (!confirm('Delete this unpaid campaign?')) return
    if (supabase) await supabase.from('campaigns').delete().eq('id', id).eq('user_id', user.id)
    else localStorage.setItem('abridge_campaigns', JSON.stringify(JSON.parse(localStorage.getItem('abridge_campaigns') || '[]').filter(c => c.id !== id)))
    setCampaigns(list => list.filter(c => c.id !== id))
  }

  async function logout() {
    if (supabase) await supabase.auth.signOut()
    localStorage.removeItem(fallbackUserKey)
    nav('/')
  }

  if (busy) return <div className="nd" style={{ display: 'block' }}><style>{css}</style><div className="nd-wrap">Loading dashboard…</div></div>

  const first = profile?.first_name || user?.user_metadata?.first_name || user?.first_name || ''
  const last = profile?.last_name || user?.user_metadata?.last_name || user?.last_name || ''
  const fullName = `${titleCaseName(first)} ${titleCaseName(last)}`.trim() || (user?.email || '').split('@')[0]
  const initials = ((first.charAt(0) || fullName.charAt(0) || '?') + (last.charAt(0) || '')).toUpperCase()
  const isAdmin = !!profile?.is_admin
  const pending = campaigns.filter(c => derivedStatus(c) === 'awaiting_payment')
  const payUrl = pending[0] ? (PAYMENT_URL) : ''
  const statusText = { awaiting_payment: 'Awaiting payment', running: 'Running', completed: 'Completed' }
  const titles = { home: 'Dashboard', analytics: 'Analytics', messages: 'Messages', customers: 'Customers', settings: 'Settings', refunds: 'Refunds' }

  const items = [
    ['Dashboard', LayoutDashboard, 'home'],
    ['Advertise', Plus, '/app/new'],
    ['Analytics', BarChart3, 'analytics'],
    ['Refunds', RotateCcw, 'refunds'], ['Messages', MessageCircle, 'messages'],
    ['Settings', Settings, 'settings'],
    ...(isAdmin ? [['Admin', ShieldCheck, '/admin']] : [])
  ]

  return <div className="nd">
    <style>{css}</style>
    <div className={'nd-scrim ' + (menu ? 'open' : '')} onClick={() => setMenu(false)} /><ChatSupport /><ChatSupport />
    <aside className={'nd-side ' + (menu ? 'open' : '')}>
      <div className="nd-profile">
        <div className="nd-avatar">{initials}</div>
        <strong>{fullName}</strong>
        <span>{user?.email}</span>
      </div>
      <nav className="nd-nav">
        {items.map(([label, Icon, to]) => to.startsWith('/')
          ? <Link key={label} to={to} className="nd-item" onClick={() => setMenu(false)}><Icon size={19} />{label}</Link>
          : <button key={label} type="button" className={'nd-item ' + (view === to ? 'on' : '')} onClick={() => { setView(to); setHelp(false); setMenu(false) }}><Icon size={19} />{label}</button>)}
      </nav>
      <button type="button" className="nd-item" onClick={logout} style={{ borderTop: '1px solid rgba(255,255,255,.12)' }}><LogOut size={19} />Log out</button>
    </aside>

    <section className="nd-main"><div className="nd-wrap">
      <div className="nd-top">
        <h1 className="nd-title">{titles[view]}</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>{user && <NotificationBell userId={user.id} createdAt={user.created_at} pendingAd={pending[0]} payUrl={payUrl} />}<button type="button" className="nd-burger" aria-label="Open menu" onClick={() => setMenu(true)}><Menu size={24} /></button></div>
      </div>

      {view === 'settings' && <ProfileSettings user={user} />}

      {view === 'analytics' && <Empty Icon={BarChart3} title="No data yet" text="Once your first campaign is running, your impressions and results will show up here." action="Advertise your product" onAction={() => nav('/app/new')} />}

      {view === 'refunds' && <div className="nd-panel"><h2>Request a refund</h2><p>Had a problem with your campaign? You can request a refund if you ran into an issue while paying, or if your ads did not run after you paid.</p><p style={{ marginTop: 12 }}>Send your request within 48 hours of payment, and include the email on your account and your payment reference so we can look into it quickly. We will review it and get back to you.</p><button type="button" className="nd-btn" onClick={() => { const to = 'abridgesupport@gmail.com', su = encodeURIComponent('Refund request'), body = encodeURIComponent('Email on my Abridge account:\nPayment reference:\nWhat happened:\n'); const phone = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent); if (phone) window.location.href = `mailto:${to}?subject=${su}&body=${body}`; else window.open(`https://mail.google.com/mail/?view=cm&fs=1&to=${to}&su=${su}&body=${body}`, '_blank', 'noopener') }}>Request a refund</button><p style={{ marginTop: 16 }}><Link to="/terms" target="_blank" style={{ fontWeight: 700, textDecoration: 'underline', color: '#1c2333' }}>Read our Refund Policy</Link></p></div>}{view === 'messages' && <Empty Icon={MessageCircle} title="No messages yet" text="When customers reach out about your product, their messages will show up here." />}

      {view === 'customers' && <>
        <button type="button" className="nd-link" style={{ marginTop: 14 }} onClick={() => setView('home')}><ChevronLeft size={15} style={{ verticalAlign: 'middle' }} /> Back to dashboard</button>
        <Empty Icon={Users} title="No customers yet" text="When customers buy or reach out through your ads, they will show up here." />
      </>}

      {view === 'home' && <>
        

        <div className="nd-bar">
          <h3 className="nd-h3">Impressions</h3>
          <button type="button" className="nd-help" aria-expanded={help} onClick={() => setHelp(h => !h)}><HelpIcon /> Help</button>
          {help && <div className="nd-help-box">
            <p style={{ margin: '0 0 10px', fontSize: 14, lineHeight: 1.6 }}>Your product gets put in front of thousands of people on the platforms they use every day. When you advertise with Abridge, your product is promoted to people across the biggest social media platforms. Anyone who is interested can tap through your WhatsApp link to message you directly.</p>
            <p style={{ margin: '0 0 12px', fontSize: 14, lineHeight: 1.6 }}>So you speak to real buyers directly, with no middleman and no waiting. We handle the advertising from start to finish, and you follow your results live on your dashboard.</p>
            
            <a href="https://web.facebook.com/ads" target="_blank" rel="noreferrer">Facebook Ads</a>
            <a href="https://ads.tiktok.com" target="_blank" rel="noreferrer">TikTok Ads</a>
            <a href="https://business.instagram.com" target="_blank" rel="noreferrer">Instagram for Business</a>
            
            
          </div>}
        </div>

        <Row icon={<FbIcon />} label="Facebook" value={IMPRESSIONS.facebook} href="https://web.facebook.com/ads" />
        <Row icon={<TtIcon />} label="TikTok" value={IMPRESSIONS.tiktok} href="https://ads.tiktok.com" />
        <Row icon={<IgIcon />} label="Instagram" value={IMPRESSIONS.instagram} href="https://business.instagram.com" />
        <Row icon={<Users size={28} />} label="Customers received" value={0} onClick={() => setView('customers')} />
        {pending.length > 0 && <Row icon={<ClockIcon />} label="Pending" value={pending.length} onClick={() => { window.location.href = payUrl }} />}

        <button type="button" className="nd-cta" onClick={() => nav('/app/new')}>Advertise your product <Plus size={18} /></button>

        <CustomersChart since={user?.created_at} />


      </>}
    </div></section>
  </div>
}
