import { createHash } from 'crypto'

/**
 * Hash a token string using SHA-256.
 *
 * Used to store refresh tokens as hashes instead of plaintext.
 * Even if the database is compromised, the raw JWTs cannot be recovered.
 */
export function hashToken(token: string): string {
  return createHash('sha256').update(token).digest('hex')
}
