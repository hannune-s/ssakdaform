// 비밀번호 단방향 암호화 유틸리티 (Web Crypto API - SHA-256)

export function isSha256Hash(value?: string | null): boolean {
  if (!value) return false;
  return /^[a-f0-9]{64}$/i.test(value.trim());
}

export async function hashPassword(plain: string): Promise<string> {
  const trimmed = String(plain ?? '');
  if (isSha256Hash(trimmed)) {
    return trimmed.toLowerCase();
  }
  const encoder = new TextEncoder();
  const data = encoder.encode(trimmed);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export async function verifyPassword(
  inputPlain: string,
  storedPassword?: string | null
): Promise<boolean> {
  if (!storedPassword) return false;
  const hashedInput = await hashPassword(inputPlain);
  if (isSha256Hash(storedPassword)) {
    return storedPassword.trim().toLowerCase() === hashedInput;
  }
  // 만약 아직 암호화되지 않은 레거시 값이 남아있더라도 비교 지원
  return storedPassword === inputPlain;
}
