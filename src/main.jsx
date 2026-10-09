import React, { useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, useNavigate, useLocation, useParams, Link, Routes, Route, Navigate } from 'react-router-dom'
import { ArrowRight, LayoutDashboard, BarChart3, Settings, BookOpen, Box, Briefcase, Check, ChevronLeft, Eye, EyeOff, GraduationCap, ImagePlus, Link as LinkIcon, LogOut, Menu, MessageCircle, Package, Plus, ShieldCheck, Ticket, Trash2, Upload, Users, Wallet } from 'lucide-react'
import { supabase, supabaseConfigured } from './lib/supabase'
import { categories, PRICE, DURATION_DAYS, PAYMENT_URL, PLANS, formatNaira, titleCaseName, daysRunning, daysLeft, derivedStatus } from './lib/data'
 import NewDashboard from './pages/Dashboard'; import KeepSignedIn from './pages/KeepSignedIn'; import TermsPage from './pages/TermsPage'; import Welcome from './pages/Welcome'; import LinkDelay from './pages/LinkDelay'; import './styles.css'; import setupPhoto from './assets/setup.jpg'; 

const fallbackUserKey = 'abridge_demo_user'
function useAuth() { const [user, setUser] = useState(null); const [loading, setLoading] = useState(true); useEffect(() => { if (!supabase) { const raw = localStorage.getItem(fallbackUserKey); setUser(raw ? JSON.parse(raw) : null); setLoading(false); return } supabase.auth.getSession().then(({ data }) => { setUser(data.session?.user || null); setLoading(false) }); const { data } = supabase.auth.onAuthStateChange((_e, s) => setUser(s?.user || null)); return () => data.subscription.unsubscribe() }, []); return { user, loading } }
function Header() { const { user } = useAuth(); const nav = useNavigate(); const [open, setOpen] = useState(false); const first = user?.user_metadata?.first_name || ''; const last = user?.user_metadata?.last_name || ''; const fullName = (first || last) ? `${first} ${last}`.trim() : (user?.email || '').split('@')[0]; const initials = ((first.charAt(0) || fullName.charAt(0) || '?') + (last.charAt(0) || fullName.charAt(1) || '')).toUpperCase(); async function logout() { if (supabase) await supabase.auth.signOut(); localStorage.removeItem(fallbackUserKey); nav('/') } return <header className="topbar"><div className="container header"><Link className="logo" to="/">Abridge</Link><nav className="nav">{user ? <div style={{ position: 'relative' }}><button onClick={() => setOpen(o => !o)} style={{ display: 'flex', alignItems: 'center', gap: 12, background: 'none', border: 0, cursor: 'pointer', font: 'inherit' }}><span style={{ textAlign: 'right', lineHeight: 1.25 }}><strong style={{ display: 'block' }}>{fullName}</strong><span className="muted" style={{ fontSize: 13 }}>{user.email}</span></span><span style={{ width: 40, height: 40, borderRadius: '50%', background: '#B7F227', color: '#14201F', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>{initials}</span></button>{open && <div style={{ position: 'absolute', right: 0, top: '110%', background: '#fff', border: '1px solid #e3e8d5', borderRadius: 12, padding: 6, minWidth: 160, boxShadow: '0 12px 28px rgba(20,32,31,0.12)' }}><Link to="/app" onClick={() => setOpen(false)} style={{ display: 'block', padding: '8px 10px' }}>Dashboard</Link><a href="#" onClick={(e) => { e.preventDefault(); setOpen(false); logout() }} style={{ display: 'block', padding: '8px 10px' }}>Log out</a></div>}</div> : <><Link className="login" to="/login">Login</Link><Link className="btn btn-primary" to="/signup">Create account</Link></>}</nav></div></header> }
function Footer() { return <footer className="footer"><div className="container" style={{ textAlign: 'center' }}>© 2026 Abridge. All Rights Reserved.</div></footer> }
function Layout({ children }) { return <div className="app"><Header />{children}<Footer /></div> }
function Landing() { const { user } = useAuth(); const nav = useNavigate(); const cards = [['Digital Products', BookOpen, 'Sell guides, templates and digital resources.'], ['Ebooks', BookOpen, 'Put useful knowledge in front of interested buyers.'], ['Courses & Memberships', GraduationCap, 'Promote learning products and communities.'], ['Event Tickets & Training', Ticket, 'Get your events and training discovered.'], ['Services', Briefcase, 'Connect your expertise with potential customers.'], ['Physical Goods', Package, 'Showcase products people can buy.']]; return <Layout><main><section className="hero"><div className="container" style={{ textAlign: 'center', maxWidth: '760px', margin: '0 auto' }}><div><h1 style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700 }}>Connecting Products With the People Who Need Them</h1><p>Promote and advertise products, reach potential customers, and provide solutions that make a difference.</p><p>Trusted by over 100K users every day, more people are turning their knowledge and skills into income, and you can too!</p><div className="hero-actions" style={{ display: 'flex', justifyContent: 'center' }}><button className="btn btn-dark" onClick={() => nav(user ? '/app' : '/signup')} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, lineHeight: 1, paddingRight: 18 }}>Get started <ArrowRight size={16} style={{ display: 'block' }} /></button></div></div></div></section><section className="section"><div className="container"><div className="center"><h2>Promote any kind of product, service or subscription</h2><p className="muted">A simple way to put your offer in front of more people.</p></div><div className="categories">{cards.map(([title, Icon, desc]) => <div className="category" key={title}><div className="icon"><Icon size={22} /></div><h3>{title}</h3><p className="muted">{desc}</p></div>)}</div></div></section><section className="section"><div className="container steps"><div><h2>It's simple and easy to set up</h2><p className="muted">Create your account, submit your product and start your campaign after payment is confirmed.</p><div className="steps-list"><div className="step"><span className="num">1</span><div><strong>Sign up and set up your account</strong><p className="muted">Create a free Abridge account in a few minutes.</p></div></div><div className="step"><span className="num">2</span><div><strong>Set up your campaign and start promoting your product</strong><p className="muted">Add your link, category, image and optional WhatsApp contact.</p></div></div></div><button className="btn btn-primary" onClick={() => nav(user ? '/app' : '/signup')}>Get started <ArrowRight size={17} /></button></div><div className="photo-card"><img src={setupPhoto} alt="A woman celebrating in front of her laptop" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', borderRadius: 'inherit' }} /><div className="floating">Submit your product link and reach potential customers</div></div> </div></section></main></Layout> }
function PasswordInput({ value, onChange }) { const [show, setShow] = useState(false); return <div className="password-wrap"><input type={show ? 'text' : 'password'} value={value} onChange={onChange} required /><button type="button" className="show" onClick={() => setShow(!show)}>{show ? 'Hide' : 'Show'}</button></div> }
function AuthPage({ signup = false }) { const nav = useNavigate(); const [form, setForm] = useState({ firstName: '', lastName: '', email: '', password: '', confirm: '' }); const [error, setError] = useState(''); const [busy, setBusy] = useState(false); const valid = form.password.length >= 8 && /[A-Za-z]/.test(form.password) && /\d/.test(form.password); async function submit(e) { e.preventDefault(); setError(''); if (signup && !valid) { setError('Password must contain 8 characters, a letter and a number.'); return } if (signup && form.password !== form.confirm) { setError('Passwords do not match.'); return } setBusy(true); try { if (supabase) { if (signup) { const { data, error } = await supabase.auth.signUp({ email: form.email, password: form.password, options: { data: { first_name: form.firstName, last_name: form.lastName } } }); if (error) throw error; if (data.session) { await supabase.from('profiles').upsert({ id: data.user.id, first_name: form.firstName, last_name: form.lastName, email: form.email }) } else throw new Error('Supabase is configured to require email confirmation. Disable email confirmation in Supabase Auth to use the requested no-verification flow.') } else { const { data, error } = await supabase.auth.signInWithPassword({ email: form.email, password: form.password }); if (error) throw error } } else { if (signup) { const u = { id: crypto.randomUUID(), email: form.email, first_name: form.firstName, last_name: form.lastName }; localStorage.setItem(fallbackUserKey, JSON.stringify(u)); } else { const u = JSON.parse(localStorage.getItem(fallbackUserKey) || 'null'); if (!u || u.email !== form.email) throw new Error('Invalid email or password. Demo mode only supports the account created in this browser.') } } nav(signup ? '/welcome' : '/app') } catch (err) { setError(err.message || 'Something went wrong.') } finally { setBusy(false) } } return <div className="auth-wrap"><div className="auth"><Link className="logo" to="/">Abridge</Link><h1>{signup ? 'Create your Abridge account' : 'Log in to your Abridge account'}</h1><p className="muted">{signup ? 'Already have an account? ' : 'New to Abridge? '}<Link to={signup ? '/login' : '/signup'} style={{ textDecoration: 'underline', fontWeight: 700 }}>{signup ? 'Log in' : 'Create an account'}</Link></p><form className="form" onSubmit={submit}>{signup && <><div className="field"><label>First Name</label><input value={form.firstName} onChange={e => setForm({ ...form, firstName: e.target.value })} required /></div><div className="field"><label>Last Name</label><input value={form.lastName} onChange={e => setForm({ ...form, lastName: e.target.value })} required /></div></>}<div className="field"><label>Email Address</label><input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required /></div><div className="field"><label>Password</label><PasswordInput value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />{signup && <div className="checklist"><span className={'check ' + (form.password.length >= 8 ? 'ok' : '')}>{form.password.length >= 8 ? '✓' : '○'} 8 characters</span><span className={'check ' + (/[A-Za-z]/.test(form.password) ? 'ok' : '')}>{/[A-Za-z]/.test(form.password) ? '✓' : '○'} a letter</span><span className={'check ' + (/\d/.test(form.password) ? 'ok' : '')}>{/\d/.test(form.password) ? '✓' : '○'} a number</span></div>}</div>{signup && <div className="field"><label>Confirm password</label><PasswordInput value={form.confirm} onChange={e => setForm({ ...form, confirm: e.target.value })} /></div>}{error && <div className="error">{error}</div>}<button className="btn btn-dark" disabled={busy}>{busy ? 'Please wait…' : signup ? 'Create account' : 'Log in'}</button></form><div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '20px 0' }}><div style={{ flex: 1, height: 1, background: '#e3e9df' }} /><span className="muted" style={{ fontSize: 12 }}>OR</span><div style={{ flex: 1, height: 1, background: '#e3e9df' }} /></div><button type="button" onClick={async () => { if (supabase) await supabase.auth.signInWithOAuth({ provider: 'google' }) }} style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, padding: '13px 21px', borderRadius: 999, border: '1px solid #dce3d9', background: '#fff', fontWeight: 700, cursor: 'pointer', fontSize: 15 }}><svg width="18" height="18" viewBox="0 0 48 48"><path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"/><path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"/><path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"/><path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"/></svg>Continue with Google</button></div></div> }
function Protected({ children }) { const { user, loading } = useAuth(); if (loading) return <div className="auth-wrap">Loading…</div>; return user ? children : <Navigate to="/login" replace /> }
async function fetchProfile(user) { if (!supabase) return JSON.parse(localStorage.getItem(fallbackUserKey) || '{}'); const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single(); return data || { first_name: user.user_metadata?.first_name || '' } }
async function fetchCampaigns(user) { if (!supabase) return JSON.parse(localStorage.getItem('abridge_campaigns') || '[]').filter(c => c.user_id === user.id); const { data, error } = await supabase.from('campaigns').select('*').eq('user_id', user.id).order('created_at', { ascending: false }); if (error) throw error; return data || [] }
function PromoIllustration() { return <svg width="150" height="122" viewBox="0 0 320 260" role="img" aria-label="A phone showing an ad campaign, with coins and a megaphone around it"><ellipse cx="160" cy="236" rx="112" ry="13" fill="#F1F9CF" /><circle cx="160" cy="118" r="102" fill="#F1F9CF" /><circle cx="70" cy="200" r="30" fill="#B7F227" /><rect x="112" y="36" width="96" height="176" rx="18" fill="#fff" stroke="#14201F" strokeWidth="3" /><rect x="142" y="45" width="36" height="6" rx="3" fill="#14201F" /><circle cx="132" cy="76" r="9" fill="#B7F227" stroke="#14201F" strokeWidth="2" /><rect x="148" y="70" width="42" height="5" rx="2.5" fill="#14201F" /><rect x="148" y="80" width="28" height="5" rx="2.5" fill="#14201F" opacity="0.35" /><rect x="124" y="102" width="72" height="52" rx="8" fill="#F3F6EA" stroke="#14201F" strokeWidth="2" /><rect x="134" y="132" width="10" height="14" rx="2" fill="#B7F227" stroke="#14201F" strokeWidth="2" /><rect x="150" y="122" width="10" height="24" rx="2" fill="#B7F227" stroke="#14201F" strokeWidth="2" /><rect x="166" y="112" width="10" height="34" rx="2" fill="#B7F227" stroke="#14201F" strokeWidth="2" /><rect x="182" y="108" width="10" height="38" rx="2" fill="#B7F227" stroke="#14201F" strokeWidth="2" /><rect x="124" y="166" width="72" height="24" rx="12" fill="#B7F227" stroke="#14201F" strokeWidth="2" /><rect x="146" y="175" width="28" height="6" rx="3" fill="#14201F" /><circle cx="72" cy="84" r="20" fill="#B7F227" stroke="#14201F" strokeWidth="2.5" /><circle cx="256" cy="118" r="16" fill="#B7F227" stroke="#14201F" strokeWidth="2.5" /><circle cx="238" cy="52" r="11" fill="#B7F227" stroke="#14201F" strokeWidth="2.5" /><g fontFamily="Inter Tight, sans-serif" fontWeight="800" textAnchor="middle" fill="#14201F"><text x="72" y="91" fontSize="20">$</text><text x="256" y="124" fontSize="16">$</text><text x="238" y="56" fontSize="11">$</text></g><g transform="translate(226 168)" stroke="#14201F" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round"><path d="M0 14 L34 0 V44 L0 30 Z" fill="#B7F227" /><rect x="-10" y="14" width="10" height="16" rx="3" fill="#B7F227" /><path fill="none" d="M8 34 v12 a4 4 0 0 0 4 4 h6 v-16" /><path fill="none" d="M44 12 q9 10 0 20" /></g><g stroke="#14201F" strokeWidth="2.5" strokeLinecap="round"><path d="M44 140 h14 M51 133 v14" /><path d="M270 70 h10 M275 65 v10" /></g></svg> }
function OldDashboard() { const { user } = useAuth(); const [profile, setProfile] = useState(null); const [campaigns, setCampaigns] = useState([]); const [busy, setBusy] = useState(true); const nav = useNavigate(); async function load() { setBusy(true); try { setProfile(await fetchProfile(user)); setCampaigns(await fetchCampaigns(user)) } catch (e) { } finally { setBusy(false) } } useEffect(() => { load() }, [user]); async function del(id) { if (!confirm('Delete this unpaid campaign?')) return; if (supabase) await supabase.from('campaigns').delete().eq('id', id).eq('user_id', user.id); else localStorage.setItem('abridge_campaigns', JSON.stringify(JSON.parse(localStorage.getItem('abridge_campaigns') || '[]').filter(c => c.id !== id))); load() } if (busy) return <div className="auth-wrap">Loading dashboard…</div>; const active = campaigns.filter(c => derivedStatus(c) === 'running').length; const spent = campaigns.filter(c => c.status !== 'awaiting_payment').reduce((s, c) => s + Number(c.price || PRICE), 0); return <div className="app-shell"><Header /><main className="main"><div className="container">{campaigns.length === 0 ? <><p style={{ fontSize: 26, fontWeight: 800, color: '#14201F', marginBottom: 4 }}>Welcome {titleCaseName(profile?.first_name)} 😊</p><p className="muted" style={{ fontSize: 14, marginTop: 0, marginBottom: 20 }}>Let's promote your product</p><div className="empty"><div className="empty-icon" style={{ background: 'transparent', width: 'auto', height: 'auto' }}><PromoIllustration /></div><h2>You don't have an ad campaign yet</h2><p className="muted">Create your first campaign to promote a product, reach potential customers, and start earning.</p><button className="btn btn-primary" onClick={() => nav('/app/new')}>Advertise your product <Plus size={17} /></button></div></> : <><div className="dash-head"><div><h1>Your campaigns</h1><p className="muted">Manage your product promotion campaigns.</p></div><button className="btn btn-primary" onClick={() => nav('/app/new')}>Advertise your product <Plus size={17} /></button></div><div className="stats"><div className="stat"><span className="muted">Running now</span><strong>{active}</strong></div><div className="stat"><span className="muted">Total campaigns</span><strong>{campaigns.length}</strong></div><div className="stat"><span className="muted">Total spent</span><strong>{formatNaira(spent)}</strong></div></div><div className="campaigns">{campaigns.map(c => <CampaignCard key={c.id} c={c} onDelete={del} />)}</div></>}</div></main></div> }
function CampaignCard({ c, onDelete }) { const nav = useNavigate(); const status = derivedStatus(c); const day = status === 'running' ? daysRunning(c.started_at) : 0; const pct = status === 'running' ? (day / DURATION_DAYS) * 100 : status === 'completed' ? 100 : 0; return <div className="campaign"><div className="thumb">{c.image_url ? <img src={c.image_url} /> : <ImagePlus size={26} style={{ margin: 35 }} />}</div><div><div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}><strong>{c.product_link}</strong><span className={'badge ' + (status === 'awaiting_payment' ? 'awaiting' : status === 'running' ? 'running' : 'completed')}>{status === 'awaiting_payment' ? 'Awaiting payment' : status === 'running' ? 'Running' : 'Completed'}</span></div><div className="muted" style={{ fontSize: 13, marginTop: 5 }}>{c.category} · {c.sub_category}</div><div className="progress"><span style={{ width: pct + '%' }} /></div><div className="muted" style={{ fontSize: 12 }}>{status === 'awaiting_payment' ? 'Not started · Starts once payment is confirmed' : status === 'completed' ? '5 of 5 days · Campaign completed' : `Day ${day} of ${DURATION_DAYS} · ${daysLeft(c.started_at)} days left`}</div></div><div className="actions">{status === 'awaiting_payment' && <a className="btn btn-dark" style={{ padding: '9px 14px' }} href={PAYMENT_URL} target="_blank">Pay now</a>} {status === 'awaiting_payment' && <button className="link-btn" onClick={() => nav('/app/new?edit=' + c.id)}>Edit</button>} {status === 'awaiting_payment' && <button className="link-btn danger" onClick={() => onDelete(c.id)}>Delete</button>}</div></div> }

function CampaignForm() { const { user } = useAuth(); const nav = useNavigate(); const params = new URLSearchParams(useLocation().search); const editId = params.get('edit'); const [data, setData] = useState({ product_link: '', category: '', sub_category: '', whatsapp_link: '', receive_messages: false, image_file: null, image_url: '' }); const [busy, setBusy] = useState(false); const [error, setError] = useState(''); useEffect(() => { if (editId) { (async () => { const list = await fetchCampaigns(user); const c = list.find(x => x.id === editId); if (c && c.status === 'awaiting_payment') setData({ ...data, ...c, image_file: null }) })() } }, [editId, user]); function update(k, v) { setData(d => ({ ...d, [k]: v })) } function validHttps(v) { try { const u = new URL(v); return u.protocol === 'https:' } catch { return false } }  function validWa(v) { return /^(https:\/\/)?(wa\.me|(www\.)?whatsapp\.com|wa\.link)\//i.test(v) } async function submit(e) { e.preventDefault(); setError(''); if (!validHttps(data.product_link)) { setError('Product link must be a valid https:// link.'); return } if (data.whatsapp_link && !validWa(data.whatsapp_link)) { setError('WhatsApp link must be a valid wa.me or whatsapp.com link.'); return } if (data.receive_messages && !data.whatsapp_link) { setError('Add a WhatsApp link when customer messages are enabled.'); return } if (!data.category || !data.sub_category) { setError('Choose a category and sub-category.'); return } setBusy(true); try { const chosenPlan = PLANS[data.plan_index ?? 2]; let image_path = data.image_path || null, image_url = data.image_url || ''; if (data.image_file) { if (supabase) { const ext = data.image_file.type.split('/')[1] || 'jpg'; const path = `${user.id}/${crypto.randomUUID()}.${ext}`; const { error: e } = await supabase.storage.from('product-images').upload(path, data.image_file, { contentType: data.image_file.type, upsert: false }); if (e) throw e; image_path = path; image_url = supabase.storage.from('product-images').getPublicUrl(path).data.publicUrl } else image_url = URL.createObjectURL(data.image_file) } const payload = { user_id: user.id, product_link: data.product_link, description: data.description || null, image_path, image_url, category: data.category, sub_category: data.sub_category, whatsapp_link: data.whatsapp_link || null, receive_messages: data.receive_messages, audience_location: data.audience_location || null, audience_interests: data.audience_interests || null, age_min: data.age_min ?? 18, age_max: data.age_max ?? 65, gender: data.gender || 'All', status: 'awaiting_payment', price: chosenPlan.price, impressions_range: chosenPlan.impressions, payment_url: chosenPlan.paymentUrl, duration_days: chosenPlan.days }; let id = editId; if (supabase) { let q; if (editId) q = await supabase.from('campaigns').update(payload).eq('id', editId).eq('user_id', user.id).select().single(); else q = await supabase.from('campaigns').insert(payload).select().single(); if (q.error) throw q.error; id = q.data.id } else { const all = JSON.parse(localStorage.getItem('abridge_campaigns') || '[]'); if (editId) { const i = all.findIndex(x => x.id === editId); all[i] = { ...all[i], ...payload } } else { id = crypto.randomUUID(); all.unshift({ ...payload, id, created_at: new Date().toISOString() }) } localStorage.setItem('abridge_campaigns', JSON.stringify(all)) } nav(`/app/campaigns/${id}/review`) } catch (e) { setError(e.message || 'Could not save campaign.') } finally { setBusy(false) } } return <div className="app-shell"><header className="topbar"><div className="container header"><Link className="logo" to="/app">Abridge</Link></div></header><main className="main"><div className="container"><div style={{ marginBottom: 20 }}><h1 className="dash-head" style={{ marginTop: 15 }}>Advertise your product</h1></div><form onSubmit={submit} className="new-grid" style={{ display: 'block', maxWidth: 640, margin: '0 auto' }}><div className="page-card form"><h2 style={{ margin: 0 }}>Product details</h2><div className="field"><label>Images</label><label className="drop"><Upload size={22} /><br /><strong>Click to select or drag and drop</strong><br /><span className="muted">Upload a clear photo of your product. Any photo size is accepted.</span><input type="file" accept="image/*" hidden onChange={e => update('image_file', e.target.files?.[0] || null)} />{data.image_file && <img className="preview" src={URL.createObjectURL(data.image_file)} />} {!data.image_file && data.image_url && <img className="preview" src={data.image_url} />}</label></div><div className="field"><label>Add product link</label><input placeholder="https://example.com/your-product" value={data.product_link || ''} onChange={e => update('product_link', e.target.value)} required /></div><div className="field"><label>Product description</label><textarea rows={1} placeholder="Briefly describe your product" style={{ width: '100%', boxSizing: 'border-box', height: 44, padding: '12px 16px', lineHeight: '18px', borderRadius: 12, border: '1px solid #dce3d9', background: '#fff', font: 'inherit', fontSize: 15, resize: 'none' }} value={data.description || ''} onChange={e => update('description', e.target.value)} /></div><div><strong>ABRIDGE DISCOVERY (CATEGORIZE YOUR PRODUCT)</strong> <span className="badge running">NEW</span></div><div className="field"><label>Categories</label><select value={data.category || ''} onChange={e => { update('category', e.target.value); update('sub_category', '') }}><option value="">Choose a category</option>{Object.keys(categories).map(c => <option key={c}>{c}</option>)}</select></div><div className="field"><label>Sub Categories</label><select value={data.sub_category || ''} disabled={!data.category} onChange={e => update('sub_category', e.target.value)}><option value="">Choose a sub-category</option>{(categories[data.category] || []).map(c => <option key={c}>{c}</option>)}</select></div><div className="field"><label>WhatsApp link</label><input required placeholder="https://wa.me/234..." value={data.whatsapp_link || ''} onChange={e => update('whatsapp_link', e.target.value)} /></div><label className="switch"><input type="checkbox" checked={!!data.receive_messages} onChange={e => update('receive_messages', e.target.checked)} /><span><strong>Receive messages from customers</strong><br /><span className="muted" style={{ fontSize: 12 }}>Turn this on to receive messages from customers.</span></span></label>{error && <div className="error">{error}</div>}<button className="btn btn-dark" disabled={busy}>{busy ? 'Saving…' : 'Advertise your product'} <ArrowRight size={17} /></button></div></form></div></main></div> }

const EST_CUSTOMERS = 17; const GRAPH = [3, 7, 11, 14, 17]

const LC_BASE = {
  orange: [22.5, 20, 14.8, 14, 18.3, 16.5, 8.5],
  blue: [14.8, 13.5, 14.2, 15.2, 19.6, 21.5, 24],
  gray: [-6.2, -5.2, -0.4, 0.9, 1.1, 4.4, 14.4]
}
const LC_COLORS = { orange: '#F28C38', blue: '#4A8BBF', gray: '#666666' }

function LiveChart({ date, time }) {
  const [vals, setVals] = useState(LC_BASE)
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const jitter = base => Object.fromEntries(Object.entries(base).map(([k, a]) => [k, a.map(v => v + (Math.random() - 0.5) * 4)]))
    let target = jitter(LC_BASE), cur = LC_BASE, raf
    const pick = setInterval(() => { target = jitter(LC_BASE) }, 1500)
    const tick = () => {
      cur = Object.fromEntries(Object.entries(cur).map(([k, a]) => [k, a.map((v, i) => v + (target[k][i] - v) * 0.04)]))
      setVals(cur)
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => { clearInterval(pick); cancelAnimationFrame(raf) }
  }, [])
  const X = i => 70 + i * 88.3
  const Y = v => 230 - v * 6
  return <svg viewBox="0 0 780 300" style={{ width: '100%', height: 'auto', display: 'block' }} role="img" aria-label="Data analysis graph">
    <text x="0" y="20" fontSize="16" fontWeight="700" fill="#14201F">Ads performance</text>
    <text x="780" y="20" fontSize="13" textAnchor="end" fill="#5d6b63">{date} · {time}</text>
    {[10, 20, 30].map(v => <g key={v}><line x1="48" x2="650" y1={Y(v)} y2={Y(v)} stroke="#cfcfcf" strokeDasharray="6 6" /><text x="0" y={Y(v) + 4} fontSize="12" fill="#888">+{v}%</text></g>)}
    <line x1="48" x2="650" y1={Y(0)} y2={Y(0)} stroke="#bbb" />
    {[['FACEBOOK', 'blue', 29], ['TIKTOK', 'orange', 19.3], ['INSTAGRAM', 'gray', 9.3]].map(([n, k, v]) => <g key={n}><rect x="676" y={Y(v) - 8} width="9" height="9" fill={LC_COLORS[k]} /><text x="692" y={Y(v)} fontSize="13" fontWeight="800" fill="#14201F">{n}</text></g>)}
    {Object.keys(LC_COLORS).map(k => { const a = vals[k], c = LC_COLORS[k]; return <g key={k}>
      <polyline points={a.map((v, i) => `${X(i)},${Y(v)}`).join(' ')} fill="none" stroke={c} strokeWidth="4" strokeLinejoin="round" strokeLinecap="round" />
      <circle cx={X(6)} cy={Y(a[6])} r="7" fill={c} />
      <text x={X(6) + 14} y={Y(a[6]) + 5} fontSize="16" fill="#777">+{Math.round(a[6])}%</text>
    </g> })}
  </svg>
}

function ReviewCustomers() {
  const [ph, setPh] = useState('idle')
  const [now, setNow] = useState(new Date())
  const busy = ph === 'loading1' || ph === 'loading2'
  const show = ph === 'shown' || ph === 'loading2' || ph === 'granted'
  useEffect(() => {
    const ms = { loading1: 20000, loading2: 10000, granted: 2500 }[ph]
    if (!ms) return
    const t = setTimeout(() => setPh(ph === 'loading2' ? 'granted' : 'shown'), ms)
    return () => clearTimeout(t)
  }, [ph])
  useEffect(() => {
    if (!show) return
    const t = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(t)
  }, [show])
  const date = now.toLocaleDateString('en-NG', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
  const time = now.toLocaleTimeString('en-NG', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
  return <div className="notice" style={{ marginTop: 22, textAlign: 'center' }} aria-live="polite">
    {busy
      ? <button type="button" className="btn btn-dark" disabled style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}><span style={{ width: 16, height: 16, border: '3px solid currentColor', borderTopColor: 'transparent', borderRadius: '50%', display: 'inline-block', animation: 'abspin .7s linear infinite' }} /> Updating…</button>
      : ph === 'granted'
        ? <button type="button" className="btn btn-primary" disabled style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}><Check size={16} /> Data granted</button>
        : <button type="button" className="btn btn-dark" onClick={() => setPh(ph === 'idle' ? 'loading1' : 'loading2')} style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>Customers to received <ArrowRight size={10} /></button>}
    {show && <div style={{ background: '#fff', borderRadius: 12, padding: 16, marginTop: 16, opacity: ph === 'loading2' ? 0.5 : 1 }}>
      <LiveChart date={date} time={time} />
      <div style={{ marginTop: 10 }}>Expected customers {'>'} <strong style={{ fontSize: 28 }}>{EST_CUSTOMERS}</strong></div>
    </div>}
  </div>
}

function Review() { const { id } = useParams(); const { user } = useAuth(); const [c, setC] = useState(null); const [agreed, setAgreed] = useState(false); const [paying, setPaying] = useState(false); useEffect(() => { fetchCampaigns(user).then(list => setC(list.find(x => x.id === id))) }, [id, user]); if (!c) return <div className="auth-wrap">Loading…</div>; return <div className="app-shell"><header className="topbar"><div className="container header"><Link className="logo" to="/app">Abridge</Link></div></header><main className="main"><div className="container review"><Link to={`/app/new?edit=${id}`} className="muted">← Edit details</Link><h1 className="dash-head" style={{ margin: '15px 0 25px' }}>Review your campaign</h1><div className="page-card"><div className="summary">{c.image_url ? <img src={c.image_url} /> : <div className="thumb" />}<div><h3 style={{ marginTop: 0 }}>Product details</h3><div className="row"><span>Product link</span><a href={c.product_link} target="_blank" style={{ textDecoration: 'underline' }}>{c.product_link}</a></div><div className="row"><span>Category</span><span>{c.category}</span></div><div className="row"><span>Sub-category</span><span>{c.sub_category}</span></div><div className="row"><span>WhatsApp link</span><span>{c.whatsapp_link || 'Not provided'}</span></div><div className="row"><span>Customer messages</span><span>{c.receive_messages ? 'On' : 'Off'}</span></div></div></div><ReviewCustomers /><div style={{ marginTop: 22 }}><div style={{ background: '#FFF8E1', border: '1px solid #F2D675', borderRadius: 12, padding: '12px 14px', fontSize: 14, lineHeight: 1.5, marginBottom: 14 }}><strong>Note:</strong> You cannot edit your ad once it is created. Please check your product link, category and other details carefully before you pay.</div>{agreed ? <button type="button" className="btn btn-primary" disabled={paying} onClick={() => { setPaying(true); setTimeout(() => { window.location.href = 'https://paystack.shop/pay/hy2mcyosog' }, 2000) }} style={{ width: '100%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>{paying ? <><span style={{ width: 18, height: 18, border: '3px solid #14201F', borderTopColor: 'transparent', borderRadius: '50%', display: 'inline-block', animation: 'abspin .7s linear infinite' }} /> Processing…</> : 'Pay and promote product'}</button> : <button type="button" className="btn btn-primary" disabled style={{ width: '100%', opacity: 0.4, cursor: 'not-allowed' }}>Pay and promote product</button>}<label style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, margin: '16px 0 8px', fontSize: 14, cursor: 'pointer' }}><input type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)} /><span>I agree to the <Link to="/terms" target="_blank" style={{ fontWeight: 700, textDecoration: 'underline' }}>Terms of Service and Refund Policy</Link></span></label><p className="muted" style={{ fontSize: 12, textAlign: 'center' }}>You will complete your payment securely on Paystack.</p></div></div></div></main><Footer /></div> }
function PaymentReceived() { return <div className="auth-wrap"><div className="auth center"><div className="empty-icon"><Check /></div><h1>Payment received</h1><p className="muted">Thanks. Your payment has been received. The campaign will begin once the Abridge team confirms the payment.</p><Link className="btn btn-dark" to="/app">Go to dashboard</Link></div></div> }
function Admin() { const { user } = useAuth(); const [profile, setProfile] = useState(null); const [campaigns, setCampaigns] = useState([]); const [tab, setTab] = useState('awaiting_payment'); const [busy, setBusy] = useState(true); async function load() { setBusy(true); try { const chosenPlan = PLANS[data.plan_index ?? 2]; const p = await fetchProfile(user); setProfile(p); if (supabase) { const { data, error } = await supabase.from('campaigns').select('*,profiles(first_name,last_name,email)').order('created_at', { ascending: false }); if (error) throw error; setCampaigns(data || []) } else setCampaigns(JSON.parse(localStorage.getItem('abridge_campaigns') || '[]')) } catch (e) { } finally { setBusy(false) } } useEffect(() => { load() }, [user]); async function markPaid(id) { if (supabase) { const { error } = await supabase.from('campaigns').update({ status: 'running', started_at: new Date().toISOString() }).eq('id', id); if (error) alert(error.message) } else { const a = JSON.parse(localStorage.getItem('abridge_campaigns') || '[]').map(c => c.id === id ? { ...c, status: 'running', started_at: new Date().toISOString() } : c); localStorage.setItem('abridge_campaigns', JSON.stringify(a)) } load() } if (busy) return <div className="auth-wrap">Loading admin…</div>; if (!profile?.is_admin) return <div className="auth-wrap"><div className="auth center"><ShieldCheck size={44} /><h1>Admin access required</h1><p className="muted">Your account is not marked as an administrator.</p><Link className="btn btn-dark" to="/app">Back to dashboard</Link></div></div>; const visible = campaigns.filter(c => derivedStatus(c) === tab); return <div className="app-shell"><Header /><main className="main"><div className="container"><h1 className="dash-head">Admin</h1><div className="admin-tabs">{[['awaiting_payment', 'Awaiting payment'], ['running', 'Running'], ['completed', 'Completed']].map(([v, l]) => <button className={'tab ' + (tab === v ? 'active' : '')} onClick={() => setTab(v)} key={v}>{l} ({campaigns.filter(c => derivedStatus(c) === v).length})</button>)}</div><div className="campaigns">{visible.map(c => <div className="page-card" key={c.id}><div style={{ display: 'flex', justifyContent: 'space-between', gap: 20, flexWrap: 'wrap' }}><div><strong>{c.profiles?.first_name} {c.profiles?.last_name}</strong><div className="muted">{c.profiles?.email}</div><div style={{ marginTop: 10 }}>{c.product_link}</div><div className="muted" style={{ fontSize: 13 }}>{c.category} · {c.sub_category}</div></div>{tab === 'awaiting_payment' && <button className="btn btn-primary" onClick={() => markPaid(c.id)}>Mark as paid and start</button>}</div></div>)}{visible.length === 0 && <div className="empty">No campaigns in this group.</div>}</div></div></main></div> }
function Terms() {
  const h = { marginTop: 28, marginBottom: 6 }
  return <Layout><main className="main"><div className="container" style={{ maxWidth: 760, lineHeight: 1.65 }}>
    <h1>Terms of Service and Refund Policy</h1>
    <p className="muted">Last updated: October 2026</p>
    <h3 style={h}>1. About Abridge</h3>
    <p>Abridge helps you promote your product or service through paid advertising campaigns. By paying for a campaign you agree to these terms.</p>
    <h3 style={h}>2. Campaigns</h3>
    <p>Each campaign runs for 5 days from the moment our team confirms your payment. Estimated impressions are estimates, not guarantees of views, clicks or sales.</p>
    <h3 style={h}>3. Your responsibilities</h3>
    <p>You confirm that you own or are authorised to promote the product you submit, that your links are accurate and safe, and that your product is legal and not misleading. We may reject or stop any campaign that breaks these rules.</p>
    <h3 style={h}>4. Payments</h3>
    <p>Payments are processed securely by Paystack. A campaign starts only after payment is confirmed.</p>
    <h3 style={h}>5. Refund Policy</h3>
    <p>Refunds are available if your campaign has not started or if we fail to deliver the campaign you paid for. Once a campaign is running, the payment is non-refundable. Refund requests must be sent within 48 hours of payment.</p>
    <h3 style={h}>6. Limitation of liability</h3>
    <p>We are not responsible for sales, income or results from your campaign, or for the content of the products you promote.</p>
    <h3 style={h}>7. Changes and contact</h3>
    <p>We may update these terms from time to time. For questions or refund requests, contact us at abridgesupport@gmail.com.</p>
  </div></main></Layout>
}
const WRITE_UP = {
  title: 'Welcome to Abridge',
  body: 'Your write-up goes here. Replace this text with your own message to new users.'
}

const dashCss = `
.dx{display:grid;grid-template-columns:250px 1fr;min-height:100vh;background:#F3F6EA;color:#14201F}
.dx-side{background:#14201F;color:#fff;display:flex;flex-direction:column;position:sticky;top:0;height:100vh}
.dx-profile{padding:28px 20px 22px;text-align:center;border-bottom:1px solid rgba(255,255,255,.12)}
.dx-avatar{width:76px;height:76px;border-radius:50%;background:#B7F227;color:#14201F;display:flex;align-items:center;justify-content:center;font-weight:800;font-size:26px;margin:0 auto 12px}
.dx-profile strong{display:block;font-size:17px}
.dx-profile span{display:block;font-size:12px;opacity:.65;margin-top:3px;word-break:break-all}
.dx-nav{flex:1;padding:12px 0;overflow-y:auto}
.dx-item{display:flex;align-items:center;gap:14px;width:100%;padding:14px 22px;background:none;border:0;border-left:4px solid transparent;color:#fff;font:inherit;font-size:15px;cursor:pointer;text-align:left;text-decoration:none}
.dx-item:hover{background:rgba(255,255,255,.07)}
.dx-item.on{background:rgba(183,242,39,.14);border-left-color:#B7F227;color:#B7F227;font-weight:700}
.dx-item.soon{opacity:.45;cursor:not-allowed}
.dx-item small{margin-left:auto;font-size:11px;border:1px solid rgba(255,255,255,.35);border-radius:99px;padding:1px 8px}
.dx-main{min-width:0}
.dx-top{display:flex;align-items:center;justify-content:space-between;background:#fff;padding:18px 28px;border-bottom:1px solid #e3e8d5}
.dx-top h1{margin:0;font-size:20px;letter-spacing:.02em}
.dx-burger{display:none;background:none;border:0;cursor:pointer;color:#14201F}
.dx-body{padding:26px 28px 48px;max-width:1100px}
.dx-stats{display:grid;grid-template-columns:repeat(3,1fr);gap:18px}
.dx-stat{background:#fff;border-radius:14px;padding:22px;box-shadow:0 8px 22px rgba(20,32,31,.07)}
.dx-stat span{color:#5d6b63;font-size:14px}
.dx-stat strong{display:block;font-size:30px;margin:6px 0 4px}
.dx-stat small{color:#5d6b63;font-size:12px}
.dx-panel{background:#fff;border-radius:14px;padding:22px;margin-top:20px;box-shadow:0 8px 22px rgba(20,32,31,.07)}
.dx-panel h2{margin:0 0 4px;font-size:18px}
.dx-panel p{margin:0;color:#5d6b63;font-size:14px;line-height:1.6}
.dx-chart{position:relative;margin-top:14px}
.dx-chart svg{width:100%;height:auto;display:block}
.dx-faded{opacity:.35}
.dx-chart-msg{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;text-align:center;padding:0 24px;font-size:14px;font-weight:600}
.dx-cta{margin-top:16px}
.dx-empty{background:#fff;border-radius:14px;padding:64px 24px;text-align:center;box-shadow:0 8px 22px rgba(20,32,31,.07)}
.dx-empty .ic{width:68px;height:68px;border-radius:50%;background:#F1F9CF;display:flex;align-items:center;justify-content:center;margin:0 auto 18px}
.dx-empty h2{margin:0 0 6px;font-size:20px}
.dx-empty p{margin:0 auto;max-width:380px;color:#5d6b63;font-size:14px;line-height:1.6}
.dx.dark{background:#0f1716;color:#e8efe4}
.dx.dark .dx-top,.dx.dark .dx-stat,.dx.dark .dx-panel,.dx.dark .dx-empty,.dx.dark .campaign{background:#1a2625;border-color:#2b3a38;color:#e8efe4}
.dx.dark .dx-stat span,.dx.dark .dx-stat small,.dx.dark .dx-panel p,.dx.dark .dx-empty p{color:#a9b8b0}
.dx.dark .dx-burger{color:#e8efe4}
.dx.dark .dx-empty .ic{background:#26361a}
.dx-scrim{display:none}
@media (max-width:860px){
.dx{grid-template-columns:1fr}
.dx-side{position:fixed;z-index:30;left:0;top:0;width:260px;transform:translateX(-100%);transition:transform .2s}
.dx-side.open{transform:none}
.dx-scrim.open{display:block;position:fixed;inset:0;background:rgba(20,32,31,.45);z-index:20}
.dx-burger{display:block}
.dx-stats{grid-template-columns:1fr}
.dx-top,.dx-body{padding-left:16px;padding-right:16px}
}
@media (prefers-reduced-motion:reduce){.dx-side{transition:none}}
`

function DashEmpty({ Icon, title, text, action, onAction }) {
  return <div className="dx-empty">
    <div className="ic"><Icon size={28} /></div>
    <h2>{title}</h2>
    <p>{text}</p>
    {action && <button className="btn btn-primary dx-cta" onClick={onAction}>{action} <Plus size={17} /></button>}
  </div>
}

function DashSettings({ prefs, setPref, priv, setPriv, onClear }) {
  const row = { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, padding: '18px 0', borderBottom: '1px solid rgba(127,140,130,.25)' }
  const sel = { padding: '8px 10px', borderRadius: 10, border: '1px solid #dce3d9', font: 'inherit', fontSize: 14 }
  if (priv) return <div className="dx-panel">
    <button type="button" className="link-btn" onClick={() => setPriv(false)}><ChevronLeft size={15} style={{ verticalAlign: 'middle' }} /> Back to settings</button>
    <h2 style={{ marginTop: 14 }}>Privacy and security</h2>
    <div style={{ ...row, borderBottom: 0 }}>
      <div><strong>Delete browsing data</strong><p>Delete history, cookies, cache, and more</p></div>
      <button type="button" className="btn btn-dark" onClick={onClear}>Delete data</button>
    </div>
    <p style={{ fontSize: 12 }}>This clears everything Abridge has saved on this device, including your settings, and logs you out. Your account and campaigns are not deleted.</p>
  </div>
  return <div className="dx-panel">
    <h2>Settings</h2>
    <div style={row}><div><strong>Page size</strong><p>Zoom the page content in or out</p></div>
      <select style={sel} value={prefs.zoom} onChange={e => setPref('zoom', Number(e.target.value))}>{[80, 90, 100, 110, 125, 150].map(z => <option key={z} value={z}>{z}%</option>)}</select></div>
    <div style={row}><div><strong>Language</strong><p>More languages are coming soon</p></div>
      <select style={sel} value={prefs.lang} onChange={e => setPref('lang', e.target.value)}><option value="en">English</option><option disabled>Français (soon)</option><option disabled>Yorùbá (soon)</option><option disabled>Hausa (soon)</option></select></div>
    <div style={row}><div><strong>Appearance</strong><p>Choose how Abridge looks</p></div>
      <select style={sel} value={prefs.theme} onChange={e => setPref('theme', e.target.value)}><option value="light">Light</option><option value="dark">Dark</option><option value="system">Use device setting</option></select></div>
    <button type="button" onClick={() => setPriv(true)} style={{ ...row, width: '100%', background: 'none', border: 0, font: 'inherit', color: 'inherit', cursor: 'pointer', textAlign: 'left' }}>
      <div><strong>Privacy and security</strong><p>Delete browsing data</p></div><ArrowRight size={18} />
    </button>
  </div>
}

function Dashboard() {
  const { user } = useAuth()
  const nav = useNavigate()
  const [profile, setProfile] = useState(null)
  const [campaigns, setCampaigns] = useState([])
  const [busy, setBusy] = useState(true)
  const [menu, setMenu] = useState(false)
  const [view, setView] = useState('overview')
  const [priv, setPriv] = useState(false)
  const [prefs, setPrefs] = useState(() => { try { return { zoom: 100, lang: 'en', theme: 'light', ...JSON.parse(localStorage.getItem('abridge_prefs') || '{}') } } catch { return { zoom: 100, lang: 'en', theme: 'light' } } })
  function setPref(k, v) { const n = { ...prefs, [k]: v }; setPrefs(n); try { localStorage.setItem('abridge_prefs', JSON.stringify(n)) } catch { } }
  async function clearData() {
    if (!confirm('Delete everything Abridge saved on this device and log you out?')) return
    try { localStorage.clear(); sessionStorage.clear(); if (window.caches) { for (const k of await caches.keys()) await caches.delete(k) } } catch (e) { console.error(e) }
    if (supabase) await supabase.auth.signOut()
    nav('/')
  }

  async function load() {
    setBusy(true)
    try { setProfile(await fetchProfile(user)); setCampaigns(await fetchCampaigns(user)) }
    catch (e) { console.error(e) }
    finally { setBusy(false) }
  }
  useEffect(() => { load() }, [user])

  async function del(id) {
    if (!confirm('Delete this unpaid campaign?')) return
    if (supabase) await supabase.from('campaigns').delete().eq('id', id).eq('user_id', user.id)
    else localStorage.setItem('abridge_campaigns', JSON.stringify(JSON.parse(localStorage.getItem('abridge_campaigns') || '[]').filter(c => c.id !== id)))
    load()
  }
  async function logout() {
    if (supabase) await supabase.auth.signOut()
    localStorage.removeItem(fallbackUserKey)
    nav('/')
  }

  if (busy) return <div className="auth-wrap">Loading dashboard…</div>

  const first = profile?.first_name || user?.user_metadata?.first_name || ''
  const last = profile?.last_name || user?.user_metadata?.last_name || ''
  const fullName = `${titleCaseName(first)} ${titleCaseName(last)}`.trim() || (user?.email || '').split('@')[0]
  const initials = ((first.charAt(0) || fullName.charAt(0) || '?') + (last.charAt(0) || '')).toUpperCase()
  const empty = campaigns.length === 0
  const dark = prefs.theme === 'dark' || (prefs.theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)
  const active = campaigns.filter(c => derivedStatus(c) === 'running').length
  const spent = campaigns.filter(c => c.status !== 'awaiting_payment').reduce((s, c) => s + Number(c.price || PRICE), 0)

  const items = [
    ['Dashboard', LayoutDashboard, 'overview'],
    ['Advertise', Plus, '/app/new'],
    ['Analytics', BarChart3, 'analytics'],
    ['Messages', MessageCircle, 'messages'],
    ['Settings', Settings, 'settings'],
    ...(profile?.is_admin ? [['Admin', ShieldCheck, '/admin']] : [])
  ]
  const stats = [
    ['Running now', active, 'Live campaigns'],
    ['Total campaigns', campaigns.length, 'All time'],
    ['Total spent', formatNaira(spent), 'Confirmed payments']
  ]

  return <div className={'dx ' + (dark ? 'dark' : '')}>
    <style>{dashCss}</style>
    <div className={'dx-scrim ' + (menu ? 'open' : '')} onClick={() => setMenu(false)} />
    <aside className={'dx-side ' + (menu ? 'open' : '')}>
      <div className="dx-profile">
        <div className="dx-avatar">{initials}</div>
        <strong>{fullName}</strong>
        <span>{user?.email}</span>
      </div>
      <nav className="dx-nav">
        {items.map(([label, Icon, to]) => to && to.startsWith('/')
          ? <Link key={label} to={to} className="dx-item" onClick={() => setMenu(false)}><Icon size={19} />{label}</Link>
          : to
            ? <button key={label} type="button" className={'dx-item ' + (view === to ? 'on' : '')} onClick={() => { setView(to); setPriv(false); setMenu(false) }}><Icon size={19} />{label}</button>
            : <button key={label} type="button" className="dx-item soon" disabled><Icon size={19} />{label}<small>Soon</small></button>)}
      </nav>
      <button type="button" className="dx-item" onClick={logout} style={{ borderTop: '1px solid rgba(255,255,255,.12)' }}><LogOut size={19} />Log out</button>
    </aside>

    <section className="dx-main">
      <div className="dx-top">
        <h1>{{ overview: 'Overview', analytics: 'Analytics', messages: 'Messages', settings: 'Settings' }[view]}</h1>
        <button type="button" className="dx-burger" aria-label="Open menu" onClick={() => setMenu(true)}><Menu size={24} /></button>
      </div>
      <div className="dx-body" style={{ zoom: prefs.zoom / 100 }}>
        {view === 'settings' ? <DashSettings prefs={prefs} setPref={setPref} priv={priv} setPriv={setPriv} onClear={clearData} />
        : view === 'analytics' ? <DashEmpty Icon={BarChart3} title="No data yet" text="Once your first campaign is running, your impressions and results will show up here." action="Advertise your product" onAction={() => nav('/app/new')} />
        : view === 'messages' ? <DashEmpty Icon={MessageCircle} title="No messages yet" text="When customers reach out about your product, their messages will show up here." />
        : <>
        <div className="dx-stats">
          {stats.map(([label, value, hint]) => <div className="dx-stat" key={label}><span>{label}</span><strong>{value}</strong><small>{hint}</small></div>)}
        </div>

        <div className="dx-panel">
          <h2>Campaign performance</h2>
          <p>{empty ? 'Your results will appear here once your first campaign is running.' : 'How your campaigns are doing.'}</p>
          <div className="dx-chart">
            <svg viewBox="0 0 600 200" role="img" aria-label="Campaign performance chart">
              {[40, 80, 120, 160].map(y => <line key={y} x1="0" x2="600" y1={y} y2={y} stroke="#e3e8d5" />)}
              <g className={empty ? 'dx-faded' : ''}>
                <path d="M0 170 C100 150 160 40 260 40 S400 110 470 110 S560 60 600 30" fill="none" stroke="#14201F" strokeWidth="3" strokeDasharray={empty ? '6 6' : undefined} />
                <path d="M0 180 C120 175 200 120 300 100 S460 70 600 120" fill="none" stroke="#B7F227" strokeWidth="3" strokeDasharray={empty ? '6 6' : undefined} />
              </g>
            </svg>
            {empty && <div className="dx-chart-msg">No data yet</div>}
          </div>
          {empty && <button className="btn btn-primary dx-cta" onClick={() => nav('/app/new')}>Advertise your product <Plus size={17} /></button>}
        </div>

        {empty
          ? <div className="dx-panel"><h2>{WRITE_UP.title}</h2><p>{WRITE_UP.body}</p></div>
          : <div className="dx-panel"><h2>Your campaigns</h2><p style={{ marginBottom: 14 }}>Manage your product promotion campaigns.</p><div className="campaigns">{campaigns.map(c => <CampaignCard key={c.id} c={c} onDelete={del} />)}</div></div>}
        </>}
      </div>
    </section>
  </div>
}

function OnlyOneAd({ children }) {
  const { user } = useAuth()
  const [ok, setOk] = useState(null)
  useEffect(() => { fetchCampaigns(user).then(list => { if (list.some(c => derivedStatus(c) === 'awaiting_payment')) { window.location.replace(PAYMENT_URL); return } setOk(!list.some(c => derivedStatus(c) === 'running')) }).catch(() => setOk(true)) }, [user?.id])
  if (ok === null) return <div className="auth-wrap">Loading…</div>
  return ok ? children : <Navigate to="/app" replace />
}

function ReviewPage() {
  const { id } = useParams()
  const { user } = useAuth()
  const [c, setC] = useState(null)
  const [agreed, setAgreed] = useState(false)
  const [paying, setPaying] = useState(false)
  const wentToPay = () => localStorage.getItem('abridge_went_to_pay') === id
  useEffect(() => { fetchCampaigns(user).then(list => setC(list.find(x => x.id === id) || false)) }, [id, user?.id])
  useEffect(() => {
    const back = e => { if (e.persisted && wentToPay()) window.location.replace('/app') }
    window.addEventListener('pageshow', back)
    return () => window.removeEventListener('pageshow', back)
  }, [id])
  if (wentToPay()) return <Navigate to="/app" replace />
  if (c === null) return <div className="auth-wrap">Loading…</div>
  if (!c || derivedStatus(c) !== 'awaiting_payment') return <Navigate to="/app" replace />
  function pay() {
    setPaying(true)
    setTimeout(() => { localStorage.setItem('abridge_went_to_pay', id); window.location.replace(PAYMENT_URL) }, 2000)
  }
  return <div className="app-shell"><header className="topbar"><div className="container header"><Link className="logo" to="/app">Abridge</Link></div></header><main className="main"><div className="container review"><h1 className="dash-head" style={{ margin: '15px 0 25px' }}>Review your campaign</h1><div className="page-card"><div className="summary">{c.image_url ? <img src={c.image_url} /> : <div className="thumb" />}<div><h3 style={{ marginTop: 0 }}>Product details</h3><div className="row"><span>Product link</span><a href={c.product_link} target="_blank" style={{ textDecoration: 'underline' }}>{c.product_link}</a></div><div className="row"><span>Category</span><span>{c.category}</span></div><div className="row"><span>Sub-category</span><span>{c.sub_category}</span></div><div className="row"><span>WhatsApp link</span><span>{c.whatsapp_link || 'Not provided'}</span></div><div className="row"><span>Customer messages</span><span>{c.receive_messages ? 'On' : 'Off'}</span></div></div></div><ReviewCustomers /><div style={{ marginTop: 22 }}><div style={{ background: '#FFF8E1', border: '1px solid #F2D675', borderRadius: 12, padding: '12px 14px', fontSize: 14, lineHeight: 1.5, marginBottom: 14 }}><strong>Note:</strong> You cannot edit your ad once it is created. Please check your product link, category and other details carefully before you pay.</div>{agreed ? <button type="button" className="btn btn-primary" disabled={paying} onClick={pay} style={{ width: '100%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>{paying ? <><span style={{ width: 18, height: 18, border: '3px solid #14201F', borderTopColor: 'transparent', borderRadius: '50%', display: 'inline-block', animation: 'abspin .7s linear infinite' }} /> Processing…</> : 'Pay and promote product'}</button> : <button type="button" className="btn btn-primary" disabled style={{ width: '100%', opacity: 0.4, cursor: 'not-allowed' }}>Pay and promote product</button>}<label style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, margin: '16px 0 8px', fontSize: 14, cursor: 'pointer' }}><input type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)} /><span>I agree to the <Link to="/terms" target="_blank" style={{ fontWeight: 700, textDecoration: 'underline' }}>Terms of Service and Refund Policy</Link></span></label><p className="muted" style={{ fontSize: 12, textAlign: 'center' }}>You will complete your payment securely on Paystack.</p></div></div></div></main><Footer /></div>
}
function App() { return <Routes><Route path="/" element={<Landing />} /><Route path="/signup" element={<AuthPage signup />} /><Route path="/login" element={<AuthPage />} /><Route path="/app" element={<Protected><NewDashboard /></Protected>} /><Route path="/app/new" element={<Protected><OnlyOneAd><CampaignForm /></OnlyOneAd></Protected>} /><Route path="/app/campaigns/:id/review" element={<Protected><ReviewPage /></Protected>} /><Route path="/app/payment-received" element={<PaymentReceived />} /><Route path="/admin" element={<Protected><Admin /></Protected>} /><Route path="/terms" element={<TermsPage />} /><Route path="/welcome" element={<Protected><Welcome /></Protected>} /><Route path="/welcome" element={<Protected><Welcome /></Protected>} /><Route path="/welcome" element={<Protected><Welcome /></Protected>} /><Route path="*" element={<Navigate to="/" replace />} /></Routes> }
createRoot(document.getElementById('root')).render(<BrowserRouter><LinkDelay /><KeepSignedIn /><App /></BrowserRouter>)
