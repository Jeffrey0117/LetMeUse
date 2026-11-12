'use client'

import { useState } from 'react'

const COPIED_MS = 1200

interface CodeBlockProps {
  code: string
  copyLabel: string
  copiedLabel: string
}

export function CodeBlock({ code, copyLabel, copiedLabel }: CodeBlockProps) {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), COPIED_MS)
    } catch {
      // Clipboard unavailable (insecure context / denied) — the code stays selectable.
    }
  }

  return (
    <div className="relative rounded-lg border border-zinc-200 bg-zinc-950">
      <button
        type="button"
        onClick={handleCopy}
        className="absolute right-2 top-2 rounded border border-zinc-700 px-2 py-1 text-xs text-zinc-300 hover:border-zinc-500 hover:text-white transition-colors"
      >
        {copied ? copiedLabel : copyLabel}
      </button>
      <pre className="overflow-x-auto p-4 pr-16 text-[12.5px] leading-relaxed text-zinc-100">
        <code className="font-mono">{code}</code>
      </pre>
    </div>
  )
}
