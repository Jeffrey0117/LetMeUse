/**
 * LetMeUse Checkout SDK
 *
 * Usage:
 *   <script src="https://your-letmeuse.com/checkout.js"></script>
 *   <script>
 *     const checkout = LetMeUseCheckout({ baseUrl: 'https://your-letmeuse.com' })
 *     checkout.open({
 *       appId: 'app_xxx',
 *       appSecret: 'xxx',
 *       productId: 'report',
 *       productName: '挽回指數完整報告',
 *       amount: 299,
 *       currency: 'TWD',
 *       successUrl: 'https://canweback.com/?paid=report',
 *       metadata: { orderId: '123' },
 *     })
 *   </script>
 */
;(function (global) {
  'use strict'

  function LetMeUseCheckout(config) {
    var baseUrl = (config && config.baseUrl) || ''

    function open(params) {
      return fetch(baseUrl + '/api/billing/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      })
        .then(function (res) { return res.json() })
        .then(function (result) {
          if (!result.success) {
            throw new Error(result.error || 'Failed to create checkout session')
          }
          // Redirect to checkout page
          var checkoutUrl = baseUrl + result.data.checkoutUrl
          window.location.href = checkoutUrl
          return result.data
        })
    }

    function openPopup(params) {
      return fetch(baseUrl + '/api/billing/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      })
        .then(function (res) { return res.json() })
        .then(function (result) {
          if (!result.success) {
            throw new Error(result.error || 'Failed to create checkout session')
          }
          var checkoutUrl = baseUrl + result.data.checkoutUrl
          var w = 480, h = 640
          var left = (screen.width - w) / 2
          var top = (screen.height - h) / 2
          var popup = window.open(
            checkoutUrl,
            'letmeuse-checkout',
            'width=' + w + ',height=' + h + ',left=' + left + ',top=' + top + ',toolbar=no,menubar=no'
          )
          return { popup: popup, sessionId: result.data.sessionId }
        })
    }

    return {
      open: open,
      openPopup: openPopup,
    }
  }

  // Export
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = LetMeUseCheckout
  } else {
    global.LetMeUseCheckout = LetMeUseCheckout
  }
})(typeof window !== 'undefined' ? window : this)
