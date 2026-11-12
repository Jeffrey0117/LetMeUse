'use client'

import { useEffect, useState, useSyncExternalStore } from 'react'
import Link from 'next/link'
import { useLang } from '@/components/layout/lang-provider'
import { CodeBlock } from './code-block'
import { HeroPreview } from './hero-preview'
import { buildScriptSnippet, buildUsageSnippet, getLandingCopy, type PreviewStyle } from './copy'

const container = 'mx-auto w-full max-w-6xl px-5 sm:px-8'
const sectionTitle = 'text-2xl font-bold tracking-tight text-zinc-900'
const primaryBtn = 'rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700 transition-colors'
const secondaryBtn = 'rounded-md border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 hover:border-zinc-500 hover:text-zinc-900 transition-colors'

const subscribeNever = () => () => {}

export function LandingPage() {
  const { locale, setLocale } = useLang()
  const copy = getLandingCopy(locale)
  const [style, setStyle] = useState<PreviewStyle>('minimal')
  const [dark, setDark] = useState(false)
  // Empty on the server, the real origin after hydration — no domain is hard-coded.
  const origin = useSyncExternalStore(subscribeNever, () => window.location.origin, () => '')

  useEffect(() => {
    // Shareable language links: /?lang=zh or /?lang=en
    const requested = new URLSearchParams(window.location.search).get('lang')
    if (requested === 'zh' || requested === 'en') setLocale(requested)
  }, [setLocale])

  useEffect(() => {
    document.documentElement.lang = locale === 'zh' ? 'zh-Hant' : 'en'
  }, [locale])

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900">
      <header className="sticky top-0 z-40 border-b border-zinc-200 bg-zinc-50/90 backdrop-blur">
        <div className={`${container} flex h-14 items-center gap-1`}>
          <Link href="/" className="mr-auto text-lg font-bold tracking-tight">LetMeUse</Link>
          <a href="#features" className="hidden px-3 py-2 text-sm text-zinc-600 hover:text-zinc-900 sm:block">{copy.nav.features}</a>
          <a href="/themes.html" className="px-3 py-2 text-sm text-zinc-600 hover:text-zinc-900">{copy.nav.styles}</a>
          <Link href="/admin" className="px-3 py-2 text-sm text-zinc-600 hover:text-zinc-900">{copy.nav.admin}</Link>
          <button
            type="button"
            onClick={() => setLocale(locale === 'en' ? 'zh' : 'en')}
            className="ml-1 rounded-md border border-zinc-300 px-3 py-1.5 text-sm text-zinc-700 hover:border-zinc-500 transition-colors"
          >
            {copy.nav.switchTo}
          </button>
        </div>
      </header>

      <section className={`${container} grid gap-10 py-12 lg:grid-cols-[1fr_400px] lg:gap-14 lg:py-20`}>
        <div className="min-w-0">
          <h1 className="text-balance text-3xl font-bold leading-tight tracking-tight sm:text-5xl sm:leading-[1.1]">{copy.hero.title}</h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-zinc-600 sm:text-lg">{copy.hero.sub}</p>
          <div className="mt-7 flex flex-wrap gap-3">
            <a href="/themes.html" className={primaryBtn}>{copy.hero.primary}</a>
            <Link href="/admin" className={secondaryBtn}>{copy.hero.secondary}</Link>
          </div>
          <div className="mt-8 max-w-xl">
            <CodeBlock
              code={buildScriptSnippet(origin, style, locale)}
              copyLabel={copy.hero.copy}
              copiedLabel={copy.hero.copied}
            />
          </div>
        </div>
        <div className="mx-auto w-full max-w-[400px]">
          <HeroPreview
            copy={copy.preview}
            locale={locale}
            style={style}
            dark={dark}
            onStyleChange={setStyle}
            onDarkChange={setDark}
          />
        </div>
      </section>

      <section className="border-y border-zinc-200 bg-white">
        <div className={`${container} grid gap-10 py-14 lg:grid-cols-2 lg:gap-14`}>
          <div>
            <h2 className={sectionTitle}>{copy.steps.title}</h2>
            <ol className="mt-6 space-y-5">
              {copy.steps.items.map((step, index) => (
                <li key={step.title} className="flex gap-4">
                  <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-zinc-300 font-mono text-sm text-zinc-600">
                    {index + 1}
                  </span>
                  <div>
                    <p className="font-semibold">{step.title}</p>
                    <p className="mt-1 text-sm leading-relaxed text-zinc-600">{step.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
          <div className="min-w-0 self-center">
            <CodeBlock
              code={buildUsageSnippet(copy.codeComment)}
              copyLabel={copy.hero.copy}
              copiedLabel={copy.hero.copied}
            />
          </div>
        </div>
      </section>

      <section id="features" className={`${container} scroll-mt-16 py-14`}>
        <h2 className={sectionTitle}>{copy.features.title}</h2>
        <div className="mt-7 grid gap-x-8 gap-y-7 sm:grid-cols-2 lg:grid-cols-4">
          {copy.features.items.map((feature) => (
            <div key={feature.title} className="border-t border-zinc-300 pt-4">
              <p className="font-semibold">{feature.title}</p>
              <p className="mt-1.5 text-sm leading-relaxed text-zinc-600">{feature.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-y border-zinc-200 bg-white">
        <div className={`${container} grid gap-8 py-14 lg:grid-cols-2 lg:gap-14`}>
          <div>
            <h2 className={sectionTitle}>{copy.styles.title}</h2>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-zinc-600">{copy.styles.body}</p>
            <a href="/themes.html" className={`${secondaryBtn} mt-6 inline-block`}>{copy.styles.cta}</a>
          </div>
          <div>
            <h2 className={sectionTitle}>{copy.admin.title}</h2>
            <p className="mt-3 text-sm leading-relaxed text-zinc-600">{copy.admin.body}</p>
            <ul className="mt-4 grid gap-x-6 gap-y-2 text-sm text-zinc-700 sm:grid-cols-2">
              {copy.admin.items.map((item) => (
                <li key={item} className="border-l-2 border-zinc-300 pl-3">{item}</li>
              ))}
            </ul>
            <Link href="/admin" className={`${primaryBtn} mt-6 inline-block`}>{copy.admin.cta}</Link>
          </div>
        </div>
      </section>

      <footer className={`${container} flex items-center gap-5 py-8 text-sm text-zinc-500`}>
        <span className="mr-auto font-semibold text-zinc-700">LetMeUse</span>
        <a href="/themes.html" className="hover:text-zinc-900">{copy.footer.styles}</a>
        <Link href="/admin" className="hover:text-zinc-900">{copy.footer.admin}</Link>
      </footer>
    </div>
  )
}
