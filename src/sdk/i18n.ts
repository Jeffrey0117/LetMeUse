/**
 * Internationalization — translation strings and helpers
 */

import type { Locale } from './types'

const i18n: Record<string, Record<string, string>> = {
  'title.login': { en: 'Sign In', zh: '登入' },
  'title.register': { en: 'Create Account', zh: '建立帳號' },
  'label.email': { en: 'Email', zh: '電子信箱' },
  'label.password': { en: 'Password', zh: '密碼' },
  'label.displayName': { en: 'Display Name', zh: '顯示名稱' },
  'btn.login': { en: 'Sign In', zh: '登入' },
  'btn.register': { en: 'Create Account', zh: '建立帳號' },
  'switch.toRegister': { en: "Don't have an account? Sign up", zh: '沒有帳號？註冊' },
  'switch.toLogin': { en: 'Already have an account? Sign in', zh: '已有帳號？登入' },
  'error.generic': { en: 'Something went wrong', zh: '發生錯誤' },
  'error.invalidCredentials': { en: 'Invalid email or password', zh: '帳號或密碼錯誤' },
  'error.accountDisabled': { en: 'Account is disabled', zh: '帳號已停用' },
  'error.loginFailed': { en: 'Login failed', zh: '登入失敗' },
  'error.registrationFailed': { en: 'Registration failed', zh: '註冊失敗' },
  'error.emailInUse': { en: 'Email already registered', zh: '此信箱已被註冊' },
  'error.tooManyAttempts': { en: 'Too many attempts, please try again later', zh: '嘗試次數過多，請稍後再試' },
  'msg.loading': { en: 'Loading...', zh: '載入中...' },
  'oauth.or': { en: 'or continue with', zh: '或使用以下方式登入' },
  'oauth.google': { en: 'Google', zh: 'Google' },
  'oauth.github': { en: 'GitHub', zh: 'GitHub' },
  'link.forgotPassword': { en: 'Forgot password?', zh: '忘記密碼？' },
  'error.passwordTooShort': { en: 'Password must be at least 8 characters', zh: '密碼至少需要 8 個字元' },
  'forgot.title': { en: 'Reset Password', zh: '重設密碼' },
  'forgot.description': { en: 'Enter your email to receive a reset link.', zh: '輸入信箱以收取重設連結。' },
  'forgot.send': { en: 'Send Reset Link', zh: '發送重設連結' },
  'forgot.sent': { en: 'Check your email for the reset link!', zh: '重設連結已寄出，請查看信箱！' },
  'forgot.backToLogin': { en: 'Back to Sign In', zh: '返回登入' },
  'profile.title': { en: 'Account Settings', zh: '帳號設定' },
  'profile.displayName': { en: 'Display Name', zh: '顯示名稱' },
  'profile.email': { en: 'Email', zh: '電子信箱' },
  'profile.role': { en: 'Role', zh: '角色' },
  'profile.save': { en: 'Save', zh: '儲存' },
  'profile.saving': { en: 'Saving...', zh: '儲存中...' },
  'profile.saved': { en: 'Saved!', zh: '已儲存！' },
  'profile.changePassword': { en: 'Change Password', zh: '變更密碼' },
  'profile.currentPassword': { en: 'Current Password', zh: '目前密碼' },
  'profile.newPassword': { en: 'New Password', zh: '新密碼' },
  'profile.confirmPassword': { en: 'Confirm Password', zh: '確認密碼' },
  'profile.passwordMismatch': { en: 'Passwords do not match', zh: '兩次密碼不一致' },
  'profile.passwordChanged': { en: 'Password changed!', zh: '密碼已變更！' },
  'profile.logout': { en: 'Log Out', zh: '登出' },
  'profile.avatar': { en: 'Change Avatar', zh: '更換頭像' },
  'profile.avatarUploading': { en: 'Uploading...', zh: '上傳中...' },
  'profile.avatarUpdated': { en: 'Avatar updated!', zh: '頭像已更新！' },
  'profile.emailVerified': { en: 'Verified', zh: '已驗證' },
  'profile.emailNotVerified': { en: 'Not verified', zh: '未驗證' },
  'profile.resendVerification': { en: 'Resend', zh: '重寄' },
  'profile.verificationSent': { en: 'Verification email sent!', zh: '驗證信已寄出！' },
}

const errorMap: Record<string, string> = {
  'Invalid credentials': 'error.invalidCredentials',
  'Account is disabled': 'error.accountDisabled',
  'Login failed': 'error.loginFailed',
  'Registration failed': 'error.registrationFailed',
  'Email already registered': 'error.emailInUse',
  'Too many requests': 'error.tooManyAttempts',
}

/** Create a translation function bound to a locale */
export function createTranslator(locale: Locale): (key: string) => string {
  return (key: string): string => {
    return i18n[key]?.[locale] ?? i18n[key]?.en ?? key
  }
}

/** Translate an API error message to a user-facing localized string */
export function translateError(apiError: string, t: (key: string) => string): string {
  const key = errorMap[apiError]
  return key ? t(key) : apiError
}
