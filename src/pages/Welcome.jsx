import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

const fallbackUserKey = 'abridge_demo_user'

// [short name, calling code]
const CODES = [['NG', '+234'], ['GH', '+233'], ['KE', '+254'], ['ZA', '+27'], ['UG', '+256'], ['TZ', '+255'], ['GB', '+44'], ['US', '+1'], ['CA', '+1'], ['AE', '+971']]
const GENDERS = ['Male', 'Female', 'Prefer not to say']
const HEARD = ['Facebook', 'TikTok', 'Instagram', 'WhatsApp', 'A friend or family member', 'Google search', 'Other']

const css = `
.ob{min-height:100vh;background:#fafbff;color:#1c2333;font-family:'DM Sans',system-ui,sans-serif;display:flex;justify-content:center;padding:32px 16px 64px}
.ob-card{width:100%;max-width:520px}
.ob-logo{font-size:26px;font-weight:800;margin-bottom:18px}
.ob-intro{margin:0 0 14px;color:#5b6385;font-size:16px;padding-bottom:14px;border-bottom:1px solid #e8eaf0}
.ob-note{display:flex;gap:14px;background:#fdeedd;color:#7a5a2e;border-radius:10px;padding:18px 20px;margin-bottom:26px}
.ob-i{flex:none;width:22px;height:22px;border:2px solid #7a5a2e;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:800;font-size:13px;margin-top:2px}
.ob-note strong{display:block;font-size:17px;margin-bottom:6px}
.ob-note ul{margin:0;padding-left:18px;font-size:15px;line-height:1.7}
.ob-field{margin-top:20px}
.ob-field label{display:block;font-size:17px;font-weight:500;margin-bottom:8px}
.ob-in{width:100%;box-sizing:border-box;padding:14px 16px;border-radius:10px;border:1px solid #dde2ee;background:#f7f8fd;font:inherit;font-size:16px;color:#1c2333}
.ob-in::placeholder{color:#b4bacb}
.ob-in:focus{outline:3px solid #B7F227;outline-offset:1px}
.ob-phone{display:flex;gap:10px}
.ob-err{margin-top:18px;color:#c0392b;font-size:14px}
.ob-btn{width:100%;margin-top:26px;background:#14201F;color:#fff;border:0;border-radius:999px;padding:16px 24px;font:inherit;font-weight:700;font-size:16px;cursor:pointer}
.ob-btn:disabled{opacity:.6;cursor:wait}
`

export default function Welcome() {
  const nav = useNavigate()
  const [user, setUser] = useState(null)
  const [first, setFirst] = useState('')
  const [last, setLast] = useState('')
  const [gender, setGender] = useState('')
  const [dob, setDob] = useState('')
  const [country, setCountry] = useState('NG')
  const [phone, setPhone] = useState('')
  const [heard, setHeard] = useState('')
  const [err, setErr] = useState('')
  const [saving, setSaving] = useState(false)

  const today = new Date().toISOString().slice(0, 10)

  useEffect(() => {
    async function load() {
      if (supabase) {
        const { data } = await supabase.auth.getSession()
        setUser(data.session?.user || null)
      } else {
        try { setUser(JSON.parse(localStorage.getItem(fallbackUserKey) || 'null')) } catch (e) { setUser(null) }
      }
    }
    load()
  }, [])

  // Fill in the name from sign up, and skip this page if it was already completed.
  useEffect(() => {
    if (!user) return
    const m = user.user_metadata || user
    let saved = null
    try { saved = JSON.parse(localStorage.getItem('abridge_profile_' + user.id) || 'null') } catch (e) { saved = null }
    if (m.onboarded || saved?.onboarded) { nav('/app', { replace: true }); return }
    setFirst(f => f || m.first_name || '')
    setLast(l => l || m.last_name || '')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  async function submit(e) {
    e.preventDefault(); setErr('')
    if (!first.trim() || !last.trim()) { setErr('Enter your first and last name.'); return }
    if (!gender) { setErr('Select your gender.'); return }
    if (!dob) { setErr('Enter your date of birth.'); return }
    if (dob > today) { setErr('Date of birth cannot be in the future.'); return }
    const digits = phone.replace(/\D/g, '')
    if (digits.length < 7 || digits.length > 12) { setErr('Enter a valid contact number.'); return }
    const code = (CODES.find(c => c[0] === country) || CODES[0])[1]
    const extra = { first_name: first.trim(), last_name: last.trim(), gender, date_of_birth: dob, phone_country: country, phone_code: code, phone: digits, heard_from: heard, onboarded: true }
    setSaving(true)
    try {
      if (supabase) {
        const { error } = await supabase.auth.updateUser({ data: extra })
        if (error) throw error
        const { error: e2 } = await supabase.from('profiles').update({ first_name: extra.first_name, last_name: extra.last_name }).eq('id', user.id)
        if (e2) throw e2
      } else {
        const raw = JSON.parse(localStorage.getItem(fallbackUserKey) || '{}')
        localStorage.setItem(fallbackUserKey, JSON.stringify({ ...raw, ...extra }))
      }
      try { localStorage.setItem('abridge_profile_' + user.id, JSON.stringify(extra)) } catch (x) { /* ignore */ }
      nav('/app', { replace: true })
    } catch (x) {
      setErr(x.message || 'Could not save your details. Please try again.')
      setSaving(false)
    }
  }

  if (!user) return <div className="ob"><style>{css}</style><div className="ob-card">Loading…</div></div>

  return <div className="ob"><style>{css}</style><div className="ob-card">
    <div className="ob-logo">Abridge</div>
    <p className="ob-intro">We'd like to get a little more info about you</p>

    <div className="ob-note">
      <span className="ob-i" aria-hidden="true">!</span>
      <div>
        <strong>Just a few things we need from you</strong>
        <ul>
          <li>You need to update your gender and date of birth.</li>
          <li>You need to update your contact number for updates and reminders.</li>
          <li>We would like to know how you heard about Abridge.</li>
        </ul>
      </div>
    </div>

    <form onSubmit={submit}>
      <div className="ob-field" style={{ marginTop: 0 }}>
        <label htmlFor="ob-first">First Name</label>
        <input id="ob-first" className="ob-in" placeholder="John" value={first} onChange={e => setFirst(e.target.value)} />
      </div>
      <div className="ob-field">
        <label htmlFor="ob-last">Last Name</label>
        <input id="ob-last" className="ob-in" placeholder="Doe" value={last} onChange={e => setLast(e.target.value)} />
      </div>
      <div className="ob-field">
        <label htmlFor="ob-gender">Gender</label>
        <select id="ob-gender" className="ob-in" value={gender} onChange={e => setGender(e.target.value)}>
          <option value="">Select Gender</option>
          {GENDERS.map(g => <option key={g} value={g}>{g}</option>)}
        </select>
      </div>
      <div className="ob-field">
        <label htmlFor="ob-dob">Date Of Birth</label>
        <input id="ob-dob" className="ob-in" type="date" max={today} value={dob} onChange={e => setDob(e.target.value)} />
      </div>
      <div className="ob-field">
        <label htmlFor="ob-phone">Contact Number For Updates And Reminders</label>
        <div className="ob-phone">
          <select aria-label="Country code" className="ob-in" style={{ width: 130, flex: 'none' }} value={country} onChange={e => setCountry(e.target.value)}>
            {CODES.map(([iso, code]) => <option key={iso} value={iso}>{iso} {code}</option>)}
          </select>
          <input id="ob-phone" className="ob-in" type="tel" inputMode="tel" placeholder="8012345678" value={phone} onChange={e => setPhone(e.target.value)} />
        </div>
      </div>
      <div className="ob-field">
        <label htmlFor="ob-heard">How Did You Hear About Abridge?</label>
        <select id="ob-heard" className="ob-in" value={heard} onChange={e => setHeard(e.target.value)}>
          <option value="">Select</option>
          {HEARD.map(h => <option key={h} value={h}>{h}</option>)}
        </select>
      </div>

      {err && <div className="ob-err" role="alert">{err}</div>}
      <button type="submit" className="ob-btn" disabled={saving}>{saving ? 'Saving…' : 'Continue'}</button>
    </form>
  </div></div>
}
