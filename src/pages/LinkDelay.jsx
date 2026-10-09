import React, { useEffect, useState } from 'react'

// Change this number to change the wait (in seconds) before a link opens.
const DELAY_SECONDS = 5

// Everything matching this selector waits before opening:
// every link, the dashboard menu options, the dashboard cards, and the main buttons.
const SELECTOR = 'a[href], .nd-item, .nd-row, .nd-cta, .nd-link, .btn'

export default function LinkDelay() {
  const [secs, setSecs] = useState(0)

  useEffect(() => {
    let bypass = null
    let timer = null
    let tick = null

    function onClick(e) {
      if (!e.target || !e.target.closest) return
      const el = e.target.closest(SELECTOR)
      if (!el) return

      // This is the click we re-send after the wait: let it through.
      if (el === bypass) { bypass = null; return }

      // Leave these alone.
      if (e.button !== 0 || e.ctrlKey || e.metaKey || e.shiftKey) return
      if (el.disabled || el.getAttribute('aria-disabled') === 'true') return
      if (el.type === 'submit') return
      if (el.tagName === 'A' && !el.getAttribute('href')) return
      if (/^\s*(Pay and promote|Processing)/.test(el.textContent || '')) return

      e.preventDefault()
      e.stopPropagation()
      if (timer) return // already waiting for another click

      const newTab = el.tagName === 'A' && el.target === '_blank'
      let win = null
      if (newTab) {
        // Open the tab now (browsers block tabs opened later), then send it to the link after the wait.
        win = window.open('', '_blank')
        if (win) {
          try { win.document.write('<title>Opening…</title><p style="font-family:sans-serif;padding:24px">Opening…</p>') } catch (err) { /* ignore */ }
        }
      }

      let left = DELAY_SECONDS
      setSecs(left)
      tick = setInterval(() => { left -= 1; setSecs(Math.max(left, 1)) }, 1000)
      timer = setTimeout(() => {
        clearInterval(tick)
        timer = null
        setSecs(0)
        if (newTab) {
          if (win) win.location.href = el.href
          else window.location.href = el.href
        } else {
          bypass = el
          el.click()
        }
      }, DELAY_SECONDS * 1000)
    }

    document.addEventListener('click', onClick, true)
    return () => {
      document.removeEventListener('click', onClick, true)
      clearTimeout(timer)
      clearInterval(tick)
    }
  }, [])

  if (!secs) return null
  return <span role="status" aria-label="Loading" style={{ position: 'fixed', top: '50%', left: '50%', marginTop: -22, marginLeft: -22, width: 44, height: 44, boxSizing: 'border-box', border: '5px solid rgba(20,32,31,.2)', borderTopColor: '#14201F', borderRadius: '50%', animation: 'abspin .7s linear infinite', zIndex: 9999, pointerEvents: 'none' }} />
  return <div role="status" aria-live="polite" style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(20,32,31,.45)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    <div style={{ background: '#fff', color: '#14201F', borderRadius: 16, padding: '28px 40px', textAlign: 'center', boxShadow: '0 20px 50px rgba(20,32,31,.3)' }}>
      <span style={{ width: 34, height: 34, border: '4px solid #14201F', borderTopColor: 'transparent', borderRadius: '50%', display: 'inline-block', animation: 'abspin .7s linear infinite' }} />
      <div style={{ marginTop: 14, fontWeight: 700, fontSize: 16 }}>Opening… {secs}</div>
    </div>
  </div>
}
