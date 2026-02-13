import { z } from 'zod'

// ── App — represents a registered client app ────────────

export const AppSchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'Name is required'),
  secret: z.string(),
  domains: z.array(z.string()),
  webhookUrl: z.string().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
})

export type App = z.infer<typeof AppSchema>

export const CreateAppSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  domains: z.array(z.string()).default([]),
  webhookUrl: z.string().optional(),
})

export type CreateAppInput = z.infer<typeof CreateAppSchema>

export const UpdateAppSchema = z.object({
  name: z.string().min(1).optional(),
  domains: z.array(z.string()).optional(),
  webhookUrl: z.string().optional(),
})

export type UpdateAppInput = z.infer<typeof UpdateAppSchema>

// ── AuthUser — belongs to an app ────────────────────────

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
  createdAt: z.string(),
  updatedAt: z.string(),
  lastLoginAt: z.string().optional(),
})

export type AuthUser = z.infer<typeof AuthUserSchema>

export const RegisterSchema = z.object({
  appId: z.string().min(1, 'App ID is required'),
  email: z.string().email('Invalid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  displayName: z.string().min(1, 'Display name is required'),
})

export type RegisterInput = z.infer<typeof RegisterSchema>

export const LoginSchema = z.object({
  appId: z.string().min(1, 'App ID is required'),
  email: z.string().email('Invalid email'),
  password: z.string().min(1, 'Password is required'),
})

export type LoginInput = z.infer<typeof LoginSchema>

export const UpdateProfileSchema = z.object({
  displayName: z.string().min(1).optional(),
  avatar: z.string().optional(),
})

export type UpdateProfileInput = z.infer<typeof UpdateProfileSchema>

export const UpdateUserAdminSchema = z.object({
  role: z.enum(AUTH_ROLES).optional(),
  disabled: z.boolean().optional(),
})

export type UpdateUserAdminInput = z.infer<typeof UpdateUserAdminSchema>

// ── RefreshToken ────────────────────────────────────────

export const RefreshTokenSchema = z.object({
  id: z.string(),
  userId: z.string(),
  appId: z.string(),
  token: z.string(),
  expiresAt: z.string(),
  createdAt: z.string(),
})

export type RefreshToken = z.infer<typeof RefreshTokenSchema>

// ── Public user (no passwordHash) ───────────────────────

export type PublicUser = Omit<AuthUser, 'passwordHash'>

export function toPublicUser(user: AuthUser): PublicUser {
  const { passwordHash: _, ...publicUser } = user
  return publicUser
}
