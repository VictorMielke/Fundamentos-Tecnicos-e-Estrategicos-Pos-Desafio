import crypto from 'node:crypto'

const ALPHABET = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'

export function generateSlug(length: number = 7): string {
  const bytes = crypto.randomBytes(length)
  let result = ''
  
  for (let i = 0; i < length; i++) {
    result += ALPHABET[bytes[i] % ALPHABET.length]
  }
  
  return result
}

// Regex para validar formato do slug
export const SLUG_REGEX = /^[a-zA-Z0-9_-]{1,30}$/
