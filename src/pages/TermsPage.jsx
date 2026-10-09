import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'

const css = `
.tp{min-height:100vh;background:#fafbff;color:#1c2333;font-family:'DM Sans',system-ui,sans-serif;display:flex;flex-direction:column}
.tp-top{padding:20px 24px;border-bottom:1px solid #e8eaf0;background:#fff}
.tp-logo{font-size:24px;font-weight:800;color:#1c2333;text-decoration:none}
.tp-main{flex:1;width:100%;max-width:760px;margin:0 auto;box-sizing:border-box;padding:36px 20px 56px;line-height:1.7}
.tp-main h1{margin:0 0 8px;font-size:30px;font-weight:800;line-height:1.25}
.tp-main h3{margin:30px 0 6px;font-size:19px}
.tp-main p{margin:0;color:#3b4256;font-size:16px}
.tp-foot{text-align:center;padding:22px;color:#5b6385;font-size:14px;border-top:1px solid #e8eaf0}
`

export default function TermsPage() {
  // If the link ends with #refund, jump straight to the Refund Policy section.
  useEffect(() => {
    const id = window.location.hash.replace('#', '')
    if (id) {
      const el = document.getElementById(id)
      if (el) el.scrollIntoView()
    }
  }, [])

  return <div className="tp">
    <style>{css}</style>
    <header className="tp-top"><Link to="/" className="tp-logo">Abridge</Link></header>
    <main className="tp-main">
      <h1>Terms of Service and Refund Policy</h1>

      <h3>1. About Abridge</h3>
      <p>Abridge helps you promote your product or service through paid advertising campaigns. By paying for ads you agree to these terms.</p>

      <h3>2. Advertising</h3>
      <p>When you advertise with Abridge, your product is promoted to people across the biggest social media platforms. Anyone who is interested can tap through your WhatsApp link to message you directly.</p>

      <h3>3. Your responsibilities</h3>
      <p>You confirm that you own or are authorised to promote the product you submit, that your links are accurate and safe, and that your product is legal and not misleading. We may reject or stop any ads that break or violate our rules.</p>

      <h3>4. Payments</h3>
      <p>Payments are processed securely by Paystack. A campaign starts only after payment is confirmed.</p>

      <h3 id="refund">5. Refund Policy</h3>
      <p>Refunds are available if your ads have not started or if we fail to deliver the ads you paid for. Once a campaign is running, the payment is non-refundable. Refund requests must be sent within 48 hours of payment.</p>
    </main>
    <footer className="tp-foot">© 2026 Abridge. All Rights Reserved.</footer>
  </div>
}
