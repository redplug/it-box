import { webcrypto } from 'node:crypto';
import { Blob as NodeBlob } from 'node:buffer';
import { afterEach, expect, it, vi } from 'vitest';
import { hashFile } from './file-hash-calculator.models';

afterEach(() => {
  vi.unstubAllGlobals();
});
it('hashes actual bytes using SHA-256 and SHA-512', async () => {
  vi.stubGlobal('crypto', webcrypto);
  const file = new NodeBlob(['abc']) as unknown as File;
  expect(await hashFile(file, 'SHA-256')).toBe('ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad');
  expect(await hashFile(file, 'SHA-512')).toBe('ddaf35a193617abacc417349ae20413112e6fa4e89a97ea20a9eeee64b55d39a2192992a274fc1a836ba3c23a3feebbd454d4423643ce80e2a9ac94fa54ca49f');
});
it('rejects unsupported algorithms, oversized files and unavailable Web Crypto', async () => {
  vi.stubGlobal('crypto', webcrypto);
  const file = new NodeBlob(['abc']) as unknown as File;
  await expect(hashFile(file, 'MD5' as 'SHA-256')).rejects.toThrow('tools.local.errors.unsupported');
  await expect(hashFile({ size: 50 * 1024 * 1024 + 1 } as File, 'SHA-256')).rejects.toThrow('tools.local.errors.fileTooLarge');
  vi.stubGlobal('crypto', {});
  await expect(hashFile(file, 'SHA-256')).rejects.toThrow('tools.file-hash-calculator.errors.unavailable');
});
