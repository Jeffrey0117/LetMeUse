/**
 * Props for an <input> that holds a secret which is NOT a login password
 * (OAuth client secrets, provider bearer tokens, API keys).
 *
 * Why not type="password": a text field followed by a password field reads as
 * "username + password" to the browser, and Chrome deliberately ignores
 * autocomplete="off" on password fields. In the admin, an unconfigured
 * provider's empty Client ID / Client Secret pair can be autofilled with the
 * admin's own login — and the next Save writes that password, in plaintext,
 * into the app's OAuth config.
 *
 * A secret is not a credential the browser should manage: render a plain text
 * field and mask it with CSS instead.
 *
 *   <input {...SECRET_INPUT_PROPS} className={`${inputClass} ${SECRET_INPUT_CLASS}`} ... />
 */
export const SECRET_INPUT_PROPS = {
  type: 'text',
  autoComplete: 'off',
  autoCorrect: 'off',
  autoCapitalize: 'off',
  spellCheck: false,
  // Password managers: this is not a login field.
  'data-lpignore': 'true',
  'data-1p-ignore': 'true',
  'data-bwignore': 'true',
  'data-form-type': 'other',
} as const

/** Tailwind arbitrary property: show dots instead of the characters. */
export const SECRET_INPUT_CLASS = '[-webkit-text-security:disc]'
