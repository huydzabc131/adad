/**
 * Cryptographic utility for secure password hashing and verification
 * Uses Web Crypto API (SHA-256) with deterministic hex digest representation.
 */

export async function hashPassword(plainText: string): Promise<string> {
  const normalized = (plainText || '').trim();
  if (!normalized) return '';

  try {
    if (typeof window !== 'undefined' && window.crypto && window.crypto.subtle) {
      const msgBuffer = new TextEncoder().encode(`algomaster_salt_2026_${normalized}`);
      const hashBuffer = await window.crypto.subtle.digest('SHA-256', msgBuffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
      return `sha256:${hashHex}`;
    }
  } catch (e) {
    console.warn('Web Crypto API not available, using fallback hashing', e);
  }

  // Pure JS fallback hash for test environments without subtle crypto
  let hash = 0x811c9dc5;
  for (let i = 0; i < normalized.length; i++) {
    hash ^= normalized.charCodeAt(i);
    hash += (hash << 1) + (hash << 4) + (hash << 7) + (hash << 8) + (hash << 24);
  }
  return `sha256:fallback_${(hash >>> 0).toString(16)}`;
}

export async function verifyPassword(plainText: string, storedHash: string): Promise<boolean> {
  if (!plainText || !storedHash) return false;

  // If already in sha256 format
  if (storedHash.startsWith('sha256:')) {
    const computed = await hashPassword(plainText);
    return computed === storedHash;
  }

  // Legacy plain-text fallback check during migration
  return plainText === storedHash;
}
