;(function () {
  const scriptTag = document.currentScript as HTMLScriptElement | null
  const BASE_URL = scriptTag?.getAttribute('data-base-url') ?? ''

  const containers = document.querySelectorAll<HTMLElement>('[data-adman-id]')

  containers.forEach(async (container) => {
    const adId = container.getAttribute('data-adman-id')
    if (!adId) return

    try {
      const res = await fetch(`${BASE_URL}/api/serve/${adId}`)
      if (!res.ok) return
      const ad = await res.json()
      renderAd(container, ad)
    } catch {
      // Silent fail - don't break the host page
    }
  })

  function escapeHtml(str: string): string {
    const div = document.createElement('div')
    div.textContent = str
    return div.innerHTML
  }

  function renderAd(container: HTMLElement, ad: Record<string, unknown>): void {
    const style = ad.style as Record<string, string | number>
    const wrapper = document.createElement('div')

    Object.assign(wrapper.style, {
      backgroundColor: style.backgroundColor,
      color: style.textColor,
      borderRadius: style.borderRadius,
      padding: style.padding,
      maxWidth: style.maxWidth,
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      zIndex: String(style.zIndex),
      boxSizing: 'border-box',
    })

    const position = ad.position as string
    if (position === 'fixed-bottom') {
      Object.assign(wrapper.style, {
        position: 'fixed',
        bottom: '0',
        left: '0',
        right: '0',
      })
    } else if (position === 'fixed-top') {
      Object.assign(wrapper.style, {
        position: 'fixed',
        top: '0',
        left: '0',
        right: '0',
      })
    }

    let html = ''

    const imageUrl = ad.imageUrl as string | undefined
    if (imageUrl) {
      const src = imageUrl.startsWith('http') ? imageUrl : `${BASE_URL}${imageUrl}`
      html += `<img src="${escapeHtml(src)}" alt="" style="max-width:100%;border-radius:4px;margin-bottom:8px" />`
    }

    html += `<h3 style="margin:0 0 6px;font-size:18px;font-weight:600">${escapeHtml(ad.headline as string)}</h3>`

    const bodyText = ad.bodyText as string
    if (bodyText) {
      html += `<p style="margin:0 0 12px;font-size:14px;opacity:0.85;line-height:1.5">${escapeHtml(bodyText)}</p>`
    }

    html += `<a href="${escapeHtml(ad.ctaUrl as string)}" target="_blank" rel="noopener noreferrer" style="display:inline-block;background:${style.ctaBackgroundColor};color:${style.ctaTextColor};padding:8px 20px;border-radius:6px;text-decoration:none;font-size:14px;font-weight:500">${escapeHtml(ad.ctaText as string)}</a>`

    wrapper.innerHTML = html

    if (position.startsWith('fixed-')) {
      document.body.appendChild(wrapper)
    } else {
      container.appendChild(wrapper)
    }
  }
})()
