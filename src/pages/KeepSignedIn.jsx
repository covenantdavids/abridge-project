import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

const KEY = 'abridge_last_place'
const demoKey = 'abridge_demo_user'

// Who is signed in right now? (reads the saved session, no network needed)
async function getUid() {
  if (supabase) {
    const { data } = await supabase.auth.getSession()
    return data.session?.user?.id || null
  }
  try { return JSON.parse(localStorage.getItem(demoKey) || 'null')?.id || null } catch (e) { return null }
}

export default function KeepSignedIn() {
  const loc = useLocation()
  const nav = useNavigate()

  // 1. Remember the page a signed-in user is on.
  useEffect(() => {
    const p = loc.pathname
    if (!(p.startsWith('/app') || p === '/admin')) return
    const path = p + loc.search
    getUid().then(uid => {
      if (uid) { try { localStorage.setItem(KEY, JSON.stringify({ uid, path })) } catch (e) { /* ignore */ } }
    })
  }, [loc.pathname, loc.search])

  // 2. When the site is opened fresh on the home page, take a signed-in user back to where they left off.
  useEffect(() => {
    if (loc.pathname !== '/') return
    getUid().then(uid => {
      if (!uid) return
      try {
        const saved = JSON.parse(localStorage.getItem(KEY) || 'null')
        if (saved && saved.uid === uid && saved.path) nav(saved.path, { replace: true })
      } catch (e) { /* ignore */ }
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // 3. Keep the sign-in fresh so a long break never signs the user out.
  useEffect(() => {
    if (!supabase) return
    const refresh = () => { supabase.auth.getSession().catch(() => { }) }
    const onVisible = () => { if (document.visibilityState === 'visible') refresh() }
    document.addEventListener('visibilitychange', onVisible)
    window.addEventListener('focus', refresh)
    window.addEventListener('online', refresh)
    const t = setInterval(refresh, 4 * 60 * 1000)
    return () => {
      document.removeEventListener('visibilitychange', onVisible)
      window.removeEventListener('focus', refresh)
      window.removeEventListener('online', refresh)
      clearInterval(t)
    }
  }, [])

  return null
}
