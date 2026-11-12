/**
 * Auth Gate Overlay
 *
 * Full-page overlay shown when the user is not authenticated.
 * Shows a message + login button. Resolves when user logs in.
 */

import type { LetMeUseUser } from '../types'
import type { AuthManager } from '../auth'
import type { ThemeManager } from '../theme'
import type { LoginModalDeps } from './login-modal'
import { createModal } from './login-modal'
import { esc } from './escape'

export interface GateOverlayDeps {
  accent: string
  auth: AuthManager
  theme: ThemeManager
  t: (key: string) => string
  getLoginModalDeps: () => LoginModalDeps
}

export interface GateOptions {
  message?: string
}

export function showGateOverlay(
  deps: GateOverlayDeps,
  options: GateOptions = {}
): Promise<LetMeUseUser> {
  const { auth, theme, t, getLoginModalDeps } = deps
  const message = options.message || t('gate.defaultMessage')
  const buttonText = t('gate.button')

  // Remove existing gate if any
  const existing = document.getElementById('lmu-gate-host')
  if (existing) {
    theme.unregisterHost(existing)
    existing.remove()
  }

  return new Promise((resolve) => {
    // If already authenticated, resolve immediately
    if (auth.currentUser) {
      resolve(auth.currentUser)
      return
    }

    const host = document.createElement('div')
    host.id = 'lmu-gate-host'
    host.style.cssText = 'position:fixed;inset:0;z-index:99998;'
    const shadow = host.attachShadow({ mode: 'closed' })

    const style = document.createElement('style')
    style.textContent = `
      :host {
        ${theme.hostVars()}
      }
      .gate-backdrop {
        position: fixed;
        inset: 0;
        background: var(--lmu-bg);
        -webkit-backdrop-filter: var(--lmu-card-filter);
        backdrop-filter: var(--lmu-card-filter);
        display: flex;
        align-items: center;
        justify-content: center;
        font-family: var(--lmu-font);
        animation: fadeIn 0.3s ease;
      }
      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      .gate-card {
        text-align: center;
        padding: 3rem 2rem;
        max-width: 360px;
        width: 100%;
      }
      .gate-icon {
        width: 64px;
        height: 64px;
        margin: 0 auto 1.5rem;
        color: var(--lmu-subtext);
        opacity: 0.5;
      }
      .gate-message {
        font-size: 1.125rem;
        color: var(--lmu-subtext);
        margin-bottom: 1.5rem;
        line-height: 1.6;
      }
      .gate-btn {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        padding: 0.75rem 2rem;
        background: var(--lmu-accent);
        color: var(--lmu-on-accent);
        border: var(--lmu-btn-border);
        border-radius: var(--lmu-btn-radius);
        box-shadow: var(--lmu-btn-shadow);
        font-size: 1rem;
        font-weight: 600;
        cursor: pointer;
        transition: opacity 0.2s;
      }
      .gate-btn:hover {
        opacity: 0.9;
      }
    `

    const container = document.createElement('div')
    container.className = 'gate-backdrop'
    container.innerHTML = `
      <div class="gate-card">
        <svg class="gate-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/>
          <polyline points="10 17 15 12 10 7"/>
          <line x1="15" y1="12" x2="3" y2="12"/>
        </svg>
        <p class="gate-message">${esc(message)}</p>
        <button class="gate-btn">${esc(buttonText)}</button>
      </div>
    `

    shadow.appendChild(style)
    shadow.appendChild(container)
    theme.registerHost(host)
    theme.applyToHost(host)
    document.body.appendChild(host)

    // Click button → open login modal
    const btn = container.querySelector('.gate-btn') as HTMLButtonElement
    btn.addEventListener('click', () => {
      createModal(getLoginModalDeps(), 'login')
    })

    // Listen for auth change → resolve and remove overlay
    const unsubscribe = auth.onAuthChange((user) => {
      if (user) {
        unsubscribe()
        theme.unregisterHost(host)
        host.remove()
        resolve(user)
      }
    })
  })
}
