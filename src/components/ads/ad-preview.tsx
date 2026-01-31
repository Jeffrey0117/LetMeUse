interface AdPreviewData {
  headline: string
  bodyText: string
  ctaText: string
  ctaUrl: string
  imageUrl?: string
  type: string
  style: {
    backgroundColor: string
    textColor: string
    ctaBackgroundColor: string
    ctaTextColor: string
    borderRadius: string
    padding: string
    maxWidth: string
  }
}

export function AdPreview({ ad }: { ad: AdPreviewData }) {
  return (
    <div
      style={{
        backgroundColor: ad.style.backgroundColor,
        color: ad.style.textColor,
        borderRadius: ad.style.borderRadius,
        padding: ad.style.padding,
        maxWidth: ad.style.maxWidth,
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
      }}
    >
      {ad.imageUrl && (
        <img
          src={ad.imageUrl}
          alt=""
          style={{
            width: '100%',
            borderRadius: '4px',
            marginBottom: '12px',
            objectFit: 'cover',
            maxHeight: ad.type === 'sidebar' ? '160px' : '200px',
          }}
        />
      )}
      <h3 style={{ margin: '0 0 6px', fontSize: '18px', fontWeight: 600 }}>
        {ad.headline || 'Headline'}
      </h3>
      {ad.bodyText && (
        <p style={{ margin: '0 0 12px', fontSize: '14px', opacity: 0.85, lineHeight: 1.5 }}>
          {ad.bodyText}
        </p>
      )}
      <a
        href={ad.ctaUrl || '#'}
        target="_blank"
        rel="noopener noreferrer"
        onClick={(e) => e.preventDefault()}
        style={{
          display: 'inline-block',
          backgroundColor: ad.style.ctaBackgroundColor,
          color: ad.style.ctaTextColor,
          padding: '8px 20px',
          borderRadius: '6px',
          textDecoration: 'none',
          fontSize: '14px',
          fontWeight: 500,
          cursor: 'pointer',
        }}
      >
        {ad.ctaText || 'Click Here'}
      </a>
    </div>
  )
}
