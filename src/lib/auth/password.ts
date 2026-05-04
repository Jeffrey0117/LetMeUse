import bcrypt from 'bcryptjs'

const SALT_ROUNDS = 12

// Pre-computed bcrypt hash for timing-safe comparison when user doesn't exist
export const DUMMY_HASH = '$2a$12$LJ3m4ys3Lk0TSwHiPbNBUeQIcxMFGpMOaVfPcBHSN85K/2nqEwvXa'

export async function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, SALT_ROUNDS)
}

export async function verifyPassword(
  plain: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(plain, hash)
}
