import { z } from 'zod'
import { getAll, getById, create, update, remove, ROLES_FILE } from './storage'

// ── Permissions ─────────────────────────────────────────

export const PERMISSIONS = [
  'users.read',
  'users.write',
  'users.delete',
  'ads.read',
  'ads.write',
  'ads.delete',
  'projects.read',
  'projects.write',
  'projects.delete',
  'apps.read',
  'apps.write',
  'roles.read',
  'roles.write',
  'webhooks.read',
  'analytics.read',
] as const

export type Permission = (typeof PERMISSIONS)[number]

// ── Role schema ─────────────────────────────────────────

export const RoleSchema = z.object({
  id: z.string(),
  appId: z.string(),
  name: z.string().min(1),
  description: z.string().optional(),
  permissions: z.array(z.enum(PERMISSIONS)),
  isDefault: z.boolean().default(false),
  isBuiltin: z.boolean().default(false),
  createdAt: z.string(),
  updatedAt: z.string(),
})

export type Role = z.infer<typeof RoleSchema>

export const CreateRoleSchema = z.object({
  appId: z.string().min(1, 'App ID is required'),
  name: z.string().min(1, 'Role name is required'),
  description: z.string().optional(),
  permissions: z.array(z.enum(PERMISSIONS)).min(1, 'At least one permission is required'),
  isDefault: z.boolean().optional(),
})

export type CreateRoleInput = z.infer<typeof CreateRoleSchema>

export const UpdateRoleSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional(),
  permissions: z.array(z.enum(PERMISSIONS)).optional(),
  isDefault: z.boolean().optional(),
})

export type UpdateRoleInput = z.infer<typeof UpdateRoleSchema>

// ── Built-in role templates ─────────────────────────────

const ALL_PERMISSIONS = [...PERMISSIONS] as Permission[]

const USER_PERMISSIONS: Permission[] = [
  'ads.read',
  'projects.read',
]

export const BUILTIN_ROLES = {
  admin: {
    name: 'admin',
    description: 'Full access to all resources',
    permissions: ALL_PERMISSIONS,
  },
  user: {
    name: 'user',
    description: 'Basic read access',
    permissions: USER_PERMISSIONS,
  },
} as const

// ── Role helpers ────────────────────────────────────────

export async function getRolesForApp(appId: string): Promise<Role[]> {
  const all = await getAll<Role>(ROLES_FILE)
  return all.filter((r) => r.appId === appId)
}

export async function getRoleByName(appId: string, roleName: string): Promise<Role | null> {
  const roles = await getRolesForApp(appId)
  return roles.find((r) => r.name === roleName) ?? null
}

export async function getPermissionsForRole(appId: string, roleName: string): Promise<Permission[]> {
  // Built-in roles
  if (roleName === 'admin') {
    return ALL_PERMISSIONS
  }

  // Check custom role first
  const customRole = await getRoleByName(appId, roleName)
  if (customRole) {
    return customRole.permissions
  }

  // Default to user permissions
  return USER_PERMISSIONS
}

export function hasPermission(userPermissions: Permission[], required: Permission): boolean {
  return userPermissions.includes(required)
}

export function hasAllPermissions(userPermissions: Permission[], required: Permission[]): boolean {
  return required.every((p) => userPermissions.includes(p))
}

export function hasAnyPermission(userPermissions: Permission[], required: Permission[]): boolean {
  return required.some((p) => userPermissions.includes(p))
}
