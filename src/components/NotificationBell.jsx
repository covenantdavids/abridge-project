import React, { useEffect, useRef, useState } from 'react'
import { Bell } from 'lucide-react'
import { supabase } from '../lib/supabase'

// Notifications come from the Supabase "notifications" table:
//  - rows with user_id empty go to EVERY user
//  - rows with a user_id go to that user only
// The welcome message is added for every user automatically.
// "Read" status is remembered on this device.
const readKey = id => `abridge_notif_lastread_${id}`

const WELCOME = {
  id: 'welcome',
  title: 'Welcome to Abridge',
  text: 'Let your product meet the right customer.',
}

function timeAgo(iso) {
  const mins = Math.floor((Date.now() - new Date(iso).getTime()) / 60000)
  if (mins < 1) return 'Just now'
  if (mins < 60) return `${mins} min ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs} hr ago`
  const days = Math.floor(hrs / 24)
  return days === 1 ? 'Yesterday' : `${days} days ago`
}

const css = `
.nb{position:relative}
.nb-btn{position:relative;display:flex;align-items:center;justify-content:center;width:40px;height:40px;background:none;border:0;border-radius:50%;cursor:pointer;color:#1c2333}
.nb-btn:hover{background:#eef0f6}
.nb-btn:focus-visible{outline:3px solid #B7F227;outline-offset:2px}
.nb-badge{position:absolute;top:2px;right:2px;min-width:18px;height:18px;padding:0 5px;box-sizing:border-box;border-radius:999px;background:#e5484d;color:#fff;font-size:11px;font-weight:700;line-height:18px;text-align:center}
.nb-panel{position:absolute;right:0;top:calc(100% + 8px);z-index:40;width:min(340px,86vw);background:#fff;border:1px solid #e4e7ef;border-radius:14px;box-shadow:0 14px 30px rgba(28,35,51,.15);overflow:hidden}
.nb-head{padding:14px 16px;border-bottom:1px solid #eef0f6}
.nb-head strong{font-size:16px}
.nb-list{max-height:360px;overflow-y:auto}
.nb-item{display:flex;gap:12px;padding:14px 16px;border-bottom:1px solid #f1f3f9}
.nb-item:last-child{border-bottom:0}
.nb-item.unread{background:rgba(183,242,39,.12)}
.nb-dot{flex:none;width:8px;height:8px;margin-top:6px;border-radius:50%;background:transparent}
.nb-item.unread .nb-dot{background:#7aa800}
.nb-item strong{display:block;font-size:14px}
.nb-item p{margin:2px 0 0;font-size:14px;line-height:1.5;color:#5b6385}
.nb-act{display:inline-block;margin-top:6px;font-size:14px;font-weight:700;color:#14201F;text-decoration:underline}
.nb-item small{display:block;margin-top:4px;font-size:12px;color:#8a92ad}
`

export default function NotificationBell({ userId, createdAt, pendingAd, payUrl }) {
  const [items, setItems] = useState([])
  const [lastRead, setLastRead] = useState(null)
  const [open, setOpen] = useState(false)
  const [seenBefore, setSeenBefore] = useState(null) // what was unread when the panel was opened
  const box = useRef(null)

  useEffect(() => {
    if (!userId) return
    try { setLastRead(localStorage.getItem(readKey(userId))) } catch { }
    let stop = false
    async function load() {
      let rows = []
      if (supabase) {
        const { data } = await supabase.from('notifications').select('*').order('created_at', { ascending: false }).limit(50)
        rows = data || []
      }
      const welcome = { ...WELCOME, created_at: createdAt || new Date().toISOString() }
      // Reminder: the user started an ad but has not paid yet
      const reminder = pendingAd ? [{
        id: 'pending-' + pendingAd.id,
        title: 'Your ad is almost ready',
        text: "You're one step away. Complete your payment and your ad goes live.",
        created_at: pendingAd.created_at || new Date().toISOString(),
        href: payUrl,
      }] : []
      const all = [...rows, welcome, ...reminder].sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      if (!stop) setItems(all)
    }
    load()
    const t = setInterval(load, 60000) // check for new notifications every minute
    return () => { stop = true; clearInterval(t) }
  }, [userId, createdAt, pendingAd?.id])

  useEffect(() => {
    if (!open) return
    const onDown = e => { if (box.current && !box.current.contains(e.target)) setOpen(false) }
    const onKey = e => { if (e.key === 'Escape') setOpen(false) }
    document.addEventListener('mousedown', onDown)
    document.addEventListener('keydown', onKey)
    return () => { document.removeEventListener('mousedown', onDown); document.removeEventListener('keydown', onKey) }
  }, [open])

  const isUnread = n => !lastRead || new Date(n.created_at) > new Date(lastRead)
  const unread = items.filter(isUnread).length

  function markAllRead() {
    if (!items.length) return
    const newest = items[0].created_at
    setLastRead(newest)
    try { localStorage.setItem(readKey(userId), newest) } catch { }
  }

  return <div className="nb" ref={box}>
    <style>{css}</style>
    <button
      type="button"
      className="nb-btn"
      aria-label={unread ? `Notifications, ${unread} unread` : 'Notifications'}
      aria-expanded={open}
      onClick={() => { if (!open) { setSeenBefore(lastRead || '0'); markAllRead() } setOpen(o => !o) }}
    >
      <Bell size={24} />
      {unread > 0 && <span className="nb-badge">{unread > 9 ? '9+' : unread}</span>}
    </button>

    {open && <div className="nb-panel" role="dialog" aria-label="Notifications">
      <div className="nb-head"><strong>Notifications</strong></div>
      <div className="nb-list">
        {items.map(n => <div key={n.id} className={'nb-item ' + (seenBefore !== null && new Date(n.created_at) > new Date(seenBefore === '0' ? 0 : seenBefore) ? 'unread' : '')}>
          <span className="nb-dot" />
          <div>
            <strong>{n.title}</strong>
            <p>{n.text}</p>
            {n.href && <a className="nb-act" href={n.href}>Complete payment</a>}
            <small>{timeAgo(n.created_at)}</small>
          </div>
        </div>)}
      </div>
    </div>}
  </div>
}
