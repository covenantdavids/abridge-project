import React, { useEffect, useMemo, useRef, useState } from 'react'
import { MessageCircle, X, ChevronRight, ChevronLeft, Search, MessagesSquare, ArrowRight } from 'lucide-react'

const SUPPORT_EMAIL = 'abridgesupport@gmail.com'
const DELAY_MS = 5000 // wait before the email opens. Set to 0 for instant.

// Edit these to change what shows in the help panel.
const FAQS = [
  {
    q: 'How do I advertise my product?',
    a: `Advertising with Abridge only takes a few minutes. Tap "Advertise" in the menu, then add your product link, a clear photo of your product, and the category that fits it best. You can also add your WhatsApp link so interested buyers can message you directly.

When you are done, you will see a review page with all your details. Check everything, then continue to payment. Your ad goes live as soon as we confirm it.`
  },
  {
    q: 'How long does my ad run?',
    a: `Every campaign runs for 48 hours. The 48 hours start counting from the day you create your ad.

You can follow your ad on your dashboard, where it shows the current day and how many hours are left.`
  },
  {
    q: 'How do I pay?',
    a: `After you review your ad, tap "Pay and promote product". You will be taken to a secure Paystack payment page, where you can complete your payment.

If you have not paid yet, your ad stays on your dashboard as "Awaiting payment" and does not start running. You can come back and pay whenever you are ready.`
  },
  {
    q: 'When will my ad start running?',
    a: `Your campaign starts automatically once you make payment.

When it is confirmed, the status of your ad on the dashboard changes from "Awaiting payment" to "Running". If you have paid and your ad is still not running after a while, please contact support and we will look into it.`
  },
  {
    q: 'Can I edit my ad after paying?',
    a: `No. Once your ad has been created, it cannot be edited. This keeps every campaign fair and makes sure the ad you paid for is the ad that runs.

So before you pay, take a moment on the review page to check your product link, category and other details. If you spot a mistake after paying, contact support and we will help you.`
  },
  {
    q: 'How do I request a refund?',
    a: `Go to "Refunds" in your dashboard menu and send us your request within 48 hours of payment. Please include the email on your account and your payment receipt, so we can find your payment quickly.

You can get a refund if your campaign has not started, or if we did not run the campaign you paid for. Once a campaign is running, the payment can no longer be refunded.`
  },
  {
    q: 'Can I run more than one ad at a time?',
    a: `You can run one ad at a time. While your current campaign is still running, you will not be able to create a new one.

Once it has finished, you are free to advertise again, either the same product or a different one.`
  }
]

const css = `
@keyframes abchat-spin{to{transform:rotate(360deg)}}
@keyframes abchat-in{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}
.abc-fab{position:fixed;right:20px;bottom:20px;z-index:25;width:60px;height:60px;border-radius:50%;border:0;background:#B7F227;color:#14201F;display:flex;align-items:center;justify-content:center;box-shadow:0 8px 20px rgba(0,0,0,.25);cursor:pointer}
.abc-fab:focus-visible,.abc-opt:focus-visible,.abc-gen:focus-visible,.abc-x:focus-visible,.abc-back:focus-visible,.abc-search input:focus-visible{outline:3px solid #B7F227;outline-offset:2px}
.abc-panel{position:fixed;right:20px;bottom:92px;z-index:26;width:min(390px,calc(100vw - 40px));height:min(640px,calc(100vh - 116px));display:flex;flex-direction:column;background:#fafbf6;border-radius:28px;box-shadow:0 18px 50px rgba(20,32,31,.35);overflow:hidden;font-family:'DM Sans',system-ui,sans-serif;color:#14201F;animation:abchat-in .18s ease-out}
.abc-head{background:#14201F;color:#fff;padding:28px 26px 62px;flex:none;position:relative}
.abc-head h2{margin:0;font-size:30px;font-weight:800;line-height:1.15}
.abc-head p{margin:6px 0 0;font-size:16px;color:#cfd8c8}
.abc-x{position:absolute;top:14px;right:14px;width:34px;height:34px;border-radius:50%;border:0;background:rgba(255,255,255,.12);color:#fff;display:flex;align-items:center;justify-content:center;cursor:pointer}
.abc-body{flex:1;overflow-y:auto;padding:0 16px 16px;margin-top:-44px}
.abc-card{background:#fff;border:1px solid #e8eaf0;border-radius:20px;box-shadow:0 6px 18px rgba(20,32,31,.1);overflow:hidden}
.abc-opt{display:flex;align-items:center;justify-content:space-between;gap:12px;width:100%;box-sizing:border-box;padding:18px 20px;background:#fff;border:0;border-bottom:1px solid #eef0f4;font:inherit;font-size:16px;font-weight:700;color:#14201F;text-align:left;cursor:pointer}
.abc-opt:hover{background:#f6fbe4}
.abc-opt svg{flex:none;color:#14201F}
.abc-search{display:flex;align-items:center;gap:10px;padding:0 20px;background:#f3f7e2}
.abc-search input{flex:1;min-width:0;border:0;background:none;font:inherit;font-size:15px;padding:17px 0;color:#14201F}
.abc-search input::placeholder{color:#5b6385}
.abc-search svg{flex:none;color:#5b6385}
.abc-gen{display:flex;align-items:center;gap:14px;width:100%;box-sizing:border-box;margin-top:16px;padding:16px 18px;background:#fff;border:1px solid #e8eaf0;border-radius:20px;box-shadow:0 4px 12px rgba(20,32,31,.07);font:inherit;color:inherit;text-align:left;cursor:pointer}
.abc-gen:hover{border-color:#B7F227}
.abc-gen:disabled{cursor:wait;opacity:.8}
.abc-gen .ic{flex:none;width:48px;height:48px;border-radius:50%;background:#eaf5c8;display:flex;align-items:center;justify-content:center;color:#14201F}
.abc-gen strong{display:block;font-size:17px}
.abc-gen small{display:block;font-size:14px;color:#5b6385;margin-top:2px}
.abc-gen .go{margin-left:auto;flex:none;color:#5b6385}
.abc-ans{background:#fff;border:1px solid #e8eaf0;border-radius:20px;box-shadow:0 6px 18px rgba(20,32,31,.1);padding:22px 22px 24px}
.abc-ans h3{margin:0 0 10px;font-size:19px;line-height:1.3}
.abc-ans p{margin:0 0 12px;font-size:15px;line-height:1.65;color:#3b4560}
.abc-back{display:inline-flex;align-items:center;gap:4px;margin:0 0 12px;padding:6px 10px 6px 4px;border:0;border-radius:999px;background:#fff;box-shadow:0 2px 8px rgba(20,32,31,.15);font:inherit;font-size:14px;font-weight:700;color:#14201F;cursor:pointer}
.abc-ans p:last-child{margin-bottom:0}
.abc-note{margin-top:16px;padding:12px 14px;background:#FFF8E1;border:1px solid #F2D675;border-radius:14px;font-size:14px;line-height:1.5;color:#14201F}
.abc-none{padding:22px 20px;font-size:15px;line-height:1.6;color:#5b6385}
.abc-foot{flex:none;border-top:1px solid #e8eaf0;padding:14px;text-align:center;font-size:14px;color:#5b6385}
@media (prefers-reduced-motion:reduce){.abc-panel{animation:none}}
`

export default function ChatSupport() {
  const [open, setOpen] = useState(false)
  const [busy, setBusy] = useState(false)
  const [current, setCurrent] = useState(null) // index in FAQS, or null
  const [query, setQuery] = useState('')
  const fabRef = useRef(null)

  useEffect(() => {
    if (!open) return
    const onKey = e => { if (e.key === 'Escape') { setOpen(false); fabRef.current?.focus() } }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  const q = query.trim().toLowerCase()
  const results = useMemo(() => {
    const all = FAQS.map((f, i) => ({ ...f, i }))
    return q ? all.filter(f => (f.q + ' ' + f.a).toLowerCase().includes(q)) : all
  }, [q])

  function toggle() {
    setOpen(o => !o)
    setCurrent(null)
    setQuery('')
  }

  function openMail() {
    if (busy) return
    setBusy(true)
    const subject = encodeURIComponent('Abridge support')
    const isPhone = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent)
    const win = isPhone ? null : window.open('', '_blank')
    if (win) win.document.write('<p style="font-family:sans-serif;padding:24px">Opening email…</p>')
    setTimeout(() => {
      if (isPhone) window.location.href = `mailto:${SUPPORT_EMAIL}?subject=${subject}`
      else if (win) win.location.href = `https://mail.google.com/mail/?view=cm&fs=1&to=${SUPPORT_EMAIL}&su=${subject}`
      else window.location.href = `mailto:${SUPPORT_EMAIL}?subject=${subject}` // pop-up blocked
      setBusy(false)
    }, DELAY_MS)
  }

  return <>
    <style>{css}</style>

    {open && <div className="abc-panel" role="dialog" aria-label="Help and support">
      <div className="abc-head">
        <h2>Hi there <span aria-hidden="true">👋</span></h2>
        <p>How can we help you today?</p>
        <button type="button" className="abc-x" aria-label="Close help" onClick={toggle}><X size={18} /></button>
      </div>

      <div className="abc-body">
        {current !== null
          ? <>
            <button type="button" className="abc-back" onClick={() => setCurrent(null)}><ChevronLeft size={16} /> Back</button>
            <div className="abc-ans">
              <h3>{FAQS[current].q}</h3>
              {FAQS[current].a.split('\n\n').map((t, i) => <p key={i}>{t}</p>)}
            </div>
          </>
          : <div className="abc-card">
            {results.map(f => <button key={f.i} type="button" className="abc-opt" onClick={() => setCurrent(f.i)}>
              <span>{f.q}</span><ChevronRight size={20} />
            </button>)}
            {results.length === 0 && <div className="abc-none">Nothing matches "{query}". Try different words, or reach out to our support team below.</div>}
            <label className="abc-search">
              <input type="search" placeholder="Search our help desk for more…" aria-label="Search the help desk" value={query} onChange={e => setQuery(e.target.value)} />
              <Search size={20} />
            </label>
          </div>}

        

        <button type="button" className="abc-gen" onClick={openMail} disabled={busy}>
          <span className="ic">
            {busy
              ? <span style={{ width: 22, height: 22, border: '3px solid #14201F', borderTopColor: 'transparent', borderRadius: '50%', display: 'inline-block', animation: 'abchat-spin .7s linear infinite' }} />
              : <MessagesSquare size={22} />}
          </span>
          <span>
            <strong>General Support</strong>
            <small>{busy ? 'Opening your email…' : 'Reach out to the Abridge support team'}</small>
          </span>
          <ArrowRight size={20} className="go" />
        </button>
      </div>

      <div className="abc-foot">Abridge Support</div>
    </div>}

    <button ref={fabRef} type="button" className="abc-fab" onClick={toggle} aria-label={open ? 'Close help' : 'Open help'} aria-expanded={open} title="Help and support">
      {open ? <X size={28} /> : <MessageCircle size={28} />}
    </button>
  </>
}