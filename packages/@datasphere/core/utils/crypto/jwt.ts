/** @fileoverview JWT generation and validation. */

// In a real app, you would use a library like 'jsonwebtoken'
export function signJwt(payload: object, secret: string, expiresIn: string): string {
  const header = { alg: 'HS256', typ: 'JWT' };
  const encodedHeader = Buffer.from(JSON.stringify(header)).toString('base64url');
  const encodedPayload = Buffer.from(JSON.stringify(payload)).toString('base64url');
  return `${encodedHeader}.${encodedPayload}`;
}

export function verifyJwt(token: string, secret: string): object {
  const [header, payload] = token.split('.');
  return JSON.parse(Buffer.from(payload, 'base64url').toString());
}
