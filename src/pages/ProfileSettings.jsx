import React, { useState } from 'react'

import { supabase } from '../lib/supabase'

const fallbackUserKey = 'abridge_demo_user'

// [short name, calling code]
const CODES = [['NG', '+234'], ['GH', '+233'], ['KE', '+254'], ['ZA', '+27'], ['UG', '+256'], ['TZ', '+255'], ['GB', '+44'], ['US', '+1'], ['CA', '+1'], ['AE', '+971']]
const GENDERS = ['Male', 'Female', 'Prefer not to say']
const HEARD = ['Facebook', 'TikTok', 'Instagram', 'WhatsApp', 'A friend or family member', 'Google search', 'Other']

export default function ProfileSettings({ user }) {
  const storeKey = 'abridge_profile_' + (user?.id || '')
  let saved = null
  try { saved = JSON.parse(localStorage.getItem(storeKey) || 'null') } catch (e) { saved = null }
  const base = user?.user_metadata || user || {}
  const meta = { ...base, ...(saved || {}) }

  const [first, setFirst] = useState(meta.first_name || '')
  const [last, setLast] = useState(meta.last_name || '')
  const [gender, setGender] = useState(meta.gender || '')
  const [dob, setDob] = useState(meta.date_of_birth || '')
  const [country, setCountry] = useState(meta.phone_country || 'NG')
  const [phone, setPhone] = useState(meta.phone || '')
  const [heard, setHeard] = useState(meta.heard_from || '')
  const [msg, setMsg] = useState('')
  const [err, setErr] = useState('')
  const [saving, setSaving] = useState(false)

  const [pw, setPw] = useState('')
  const [pw2, setPw2] = useState('')
  const [pwMsg, setPwMsg] = useState('')
  const [pwErr, setPwErr] = useState('')
  const [pwBusy, setPwBusy] = useState(false)

  const today = new Date().toISOString().slice(0, 10)

  async function saveProfile(e) {
    e.preventDefault(); setMsg(''); setErr('')
    if (!first.trim() || !last.trim()) { setErr('Enter your first and last name.'); return }
    const digits = phone.replace(/\D/g, '')
    if (phone && (digits.length < 7 || digits.length > 12)) { setErr('Enter a valid contact number.'); return }
    if (dob && dob > today) { setErr('Date of birth cannot be in the future.'); return }
    const code = (CODES.find(c => c[0] === country) || CODES[0])[1]
    const extra = { first_name: first.trim(), last_name: last.trim(), gender, date_of_birth: dob, phone_country: country, phone_code: code, phone: digits, heard_from: heard }
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
      try { localStorage.setItem(storeKey, JSON.stringify(extra)) } catch (x) { /* ignore */ }
      setMsg('Your profile has been saved. Refresh the page to see your new name in the menu.')
    } catch (x) { setErr(x.message || 'Could not save your profile.') } finally { setSaving(false) }
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
      <h2>Profile</h2>
      <p>Tell us a little about yourself.</p>
      <form onSubmit={saveProfile}>
        <div className="nd-grid">
          <div><label className="nd-lab" htmlFor="pf-first">First name</label><input id="pf-first" className="nd-input" value={first} onChange={e => setFirst(e.target.value)} /></div>
          <div><label className="nd-lab" htmlFor="pf-last">Last name</label><input id="pf-last" className="nd-input" value={last} onChange={e => setLast(e.target.value)} /></div>
        </div>

        <div style={{ marginTop: 14 }}>
          <label className="nd-lab" htmlFor="pf-email">Email address</label>
          <input id="pf-email" className="nd-input" style={{ opacity: 0.6, cursor: 'not-allowed' }} value={user?.email || ''} disabled readOnly />
        </div>

        <div style={{ marginTop: 14 }}>
          <label className="nd-lab" htmlFor="pf-gender">Gender</label>
          <select id="pf-gender" className="nd-input" value={gender} onChange={e => setGender(e.target.value)}>
            <option value="">Select</option>
            {GENDERS.map(g => <option key={g} value={g}>{g}</option>)}
          </select>
        </div>

        <div style={{ marginTop: 14 }}>
          <label className="nd-lab" htmlFor="pf-dob">Date of birth</label>
          <input id="pf-dob" className="nd-input" type="date" max={today} value={dob} onChange={e => setDob(e.target.value)} />
        </div>

        <div style={{ marginTop: 14 }}>
          <label className="nd-lab" htmlFor="pf-phone">Contact number for updates and reminders</label>
          <div style={{ display: 'flex', gap: 10 }}>
            <select aria-label="Country code" className="nd-input" style={{ width: 130, flex: 'none' }} value={country} onChange={e => setCountry(e.target.value)}>
              {CODES.map(([iso, code]) => <option key={iso} value={iso}>{iso} {code}</option>)}
            </select>
            <input id="pf-phone" className="nd-input" type="tel" inputMode="tel" placeholder="8012345678" value={phone} onChange={e => setPhone(e.target.value)} />
          </div>
        </div>

        <div style={{ marginTop: 14 }}>
          <label className="nd-lab" htmlFor="pf-heard">How did you hear about Abridge?</label>
          <select id="pf-heard" className="nd-input" value={heard} onChange={e => setHeard(e.target.value)}>
            <option value="">Select</option>
            {HEARD.map(h => <option key={h} value={h}>{h}</option>)}
          </select>
        </div>

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
          <div><label className="nd-lab" htmlFor="pf-pw">New password</label><input id="pf-pw" className="nd-input" type="password" value={pw} onChange={e => setPw(e.target.value)} /></div>
          <div><label className="nd-lab" htmlFor="pf-pw2">Confirm new password</label><input id="pf-pw2" className="nd-input" type="password" value={pw2} onChange={e => setPw2(e.target.value)} /></div>
        </div>
        {pwErr && <div className="nd-err">{pwErr}</div>}
        {pwMsg && <div className="nd-ok">{pwMsg}</div>}
        <button className="nd-btn" disabled={pwBusy}>{pwBusy ? 'Updating…' : 'Update password'}</button>
      </form>
    </div>


  </>
}
