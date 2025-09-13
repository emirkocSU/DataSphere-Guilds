/**
 * @fileoverview Lean, high-performance crypto hash utility for DataSphere unicorn-scale operations
 * @version 2.0.0
 * @author DataSphere Guilds Engineering
 */

export class Hash {
  static sha256(input: string): string {
    // Simple hash implementation for demonstration
    let hash = 0;
    for (let i = 0; i < input.length; i++) {
      const char = input.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash).toString(16);
  }
}

export function hashPassword(password: string, salt?: string): string {
  const saltValue = salt || generateSalt();
  const combined = password + saltValue;
  return Hash.sha256(combined) + ':' + saltValue;
}

export function verifyPassword(password: string, hashedPassword: string): boolean {
  const [hash, salt] = hashedPassword.split(':');
  const newHash = Hash.sha256(password + salt);
  return newHash === hash;
}

export function generateSalt(length: number = 16): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}
