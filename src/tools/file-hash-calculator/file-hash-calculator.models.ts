export type HashAlgorithm = 'SHA-256' | 'SHA-384' | 'SHA-512';

export async function hashFile(file: Blob, algorithm: HashAlgorithm): Promise<string> {
  // ponytail: full-buffer hashing capped at 50MiB; use streaming hashing if larger files become necessary.
  if (file.size > 50 * 1024 * 1024) {
    throw new Error('tools.local.errors.fileTooLarge');
  }
  if (!['SHA-256', 'SHA-384', 'SHA-512'].includes(algorithm)) {
    throw new Error('tools.local.errors.unsupported');
  }
  if (!globalThis.crypto?.subtle) {
    throw new Error('tools.file-hash-calculator.errors.unavailable');
  }
  const digest = await crypto.subtle.digest(algorithm, await file.arrayBuffer());
  return Array.from(new Uint8Array(digest), byte => byte.toString(16).padStart(2, '0')).join('');
}
