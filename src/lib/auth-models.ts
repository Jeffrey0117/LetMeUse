import { z } from 'zod'

/** Strip all HTML tags from a string to prevent XSS via displayName. */
export function stripHtml(input: string): string {
  // Remove whole tags first, then any stray angle bracket: an unclosed `<img onerror=…`
  // has no closing `>` for the tag pattern to match.
  return input.replace(/<[^>]*>/g, '').replace(/[<>]/g, '').trim()
}

/**
 * A member may point their avatar at an https image. Paths under /uploads are
 * written only by the avatar upload route itself — accepting them here would
 * let one member name (and on their next upload, delete) another member's file.
 */
const AVATAR_URL = /^https:\/\/[^\s"'<>`\\]+$/

// ?�?� App ??represents a registered client app ?�?�?�?�?�?�?�?�?�?�?�?�

export const OAuthProviderConfigSchema = z.object({
  clientId: z.string(),
  clientSecret: z.string(),
  enabled: z.boolean().default(false),
})

export type OAuthProviderConfig = z.infer<typeof OAuthProviderConfigSchema>

export const OAuthProvidersSchema = z.object({
  google: OAuthProviderConfigSchema.optional(),
  github: OAuthProviderConfigSchema.optional(),
})

export type OAuthProviders = z.infer<typeof OAuthProvidersSchema>

export const OAUTH_PROVIDER_NAMES = ['google', 'github'] as const
export type OAuthProviderName = (typeof OAUTH_PROVIDER_NAMES)[number]

export const PurchaseVerifySchema = z.object({
  enabled: z.boolean(),
  providerUrl: z.string().url(),
  providerSecret: z.string(),
  purchasePageUrl: z.string().url(),
  courseId: z.string().optional(),
})

export type PurchaseVerifyConfig = z.infer<typeof PurchaseVerifySchema>

export const AppSchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'Name is required'),
  secret: z.string(),
  domains: z.array(z.string()),
  webhookUrl: z.string().optional(),
  oauthProviders: OAuthProvidersSchema.optional(),
  requireEmailVerification: z.boolean().optional(),
  purchaseVerify: PurchaseVerifySchema.optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
})

export type App = z.infer<typeof AppSchema>

export const CreateAppSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  domains: z.array(z.string()).default([]),
  webhookUrl: z.string().optional(),
  oauthProviders: OAuthProvidersSchema.optional(),
})

export type CreateAppInput = z.infer<typeof CreateAppSchema>

export const UpdateAppSchema = z.object({
  name: z.string().min(1).optional(),
  domains: z.array(z.string()).optional(),
  webhookUrl: z.string().optional(),
  oauthProviders: OAuthProvidersSchema.optional(),
  requireEmailVerification: z.boolean().optional(),
  purchaseVerify: PurchaseVerifySchema.optional(),
})

export type UpdateAppInput = z.infer<typeof UpdateAppSchema>

// ?�?� AuthUser ??belongs to an app ?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�

export const AUTH_ROLES = ['user', 'admin'] as const

export const AuthUserSchema = z.object({
  id: z.string(),
  appId: z.string(),
  email: z.string().email(),
  passwordHash: z.string(),
  displayName: z.string(),
  avatar: z.string().optional(),
  role: z.enum(AUTH_ROLES),
  disabled: z.boolean(),
  emailVerified: z.boolean().optional(),
  oauthProvider: z.string().optional(),
  oauthId: z.string().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
  lastLoginAt: z.string().optional(),
})

export type AuthUser = z.infer<typeof AuthUserSchema>

const PasswordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')

const LocaleSchema = z.enum(['en', 'zh']).optional().default('en')

export const RegisterSchema = z.object({
  appId: z.string().min(1, 'App ID is required'),
  email: z.string().email('Invalid email'),
  password: PasswordSchema,
  displayName: z.string().min(1, 'Display name is required').transform(stripHtml),
  locale: LocaleSchema,
})

export type RegisterInput = z.infer<typeof RegisterSchema>

export const LoginSchema = z.object({
  appId: z.string().min(1, 'App ID is required'),
  email: z.string().email('Invalid email'),
  password: z.string().min(1, 'Password is required'),
})

export type LoginInput = z.infer<typeof LoginSchema>

export const UpdateProfileSchema = z.object({
  displayName: z.string().min(1).transform(stripHtml).optional(),
  avatar: z.string().max(500).regex(AVATAR_URL).optional(),
})

export type UpdateProfileInput = z.infer<typeof UpdateProfileSchema>

export const UpdateUserAdminSchema = z.object({
  role: z.string().min(1).optional(),
  disabled: z.boolean().optional(),
})

export type UpdateUserAdminInput = z.infer<typeof UpdateUserAdminSchema>

// ?�?� RefreshToken ?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�

export const RefreshTokenSchema = z.object({
  id: z.string(),
  userId: z.string(),
  appId: z.string(),
  tokenHash: z.string(),
  expiresAt: z.string(),
  createdAt: z.string(),
})

export type RefreshToken = z.infer<typeof RefreshTokenSchema>

// ?�?� Verification Token ?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�

export const VerificationTokenSchema = z.object({
  id: z.string(),
  userId: z.string(),
  appId: z.string(),
  type: z.enum(['email_verification', 'password_reset']),
  tokenHash: z.string(),
  expiresAt: z.string(),
  createdAt: z.string(),
})

export type VerificationToken = z.infer<typeof VerificationTokenSchema>

export const ForgotPasswordSchema = z.object({
  appId: z.string().min(1, 'App ID is required'),
  email: z.string().email('Invalid email'),
  locale: LocaleSchema,
})

export type ForgotPasswordInput = z.infer<typeof ForgotPasswordSchema>

export const ResetPasswordSchema = z.object({
  token: z.string().min(1, 'Token is required'),
  password: PasswordSchema,
})

export type ResetPasswordInput = z.infer<typeof ResetPasswordSchema>

// ?�?� Public user (no passwordHash) ?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�

export type PublicUser = Omit<AuthUser, 'passwordHash'>

export function toPublicUser(user: AuthUser): PublicUser {
  const { passwordHash: _, ...publicUser } = user
  return publicUser
}
