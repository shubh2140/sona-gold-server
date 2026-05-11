import * as argon from 'argon2';
import PasswordHash from './password.hash';

export default class PasswordHashWithArgon implements PasswordHash {
  async hashPassword(password: string): Promise<string> {
    if (password.length == 0) throw new Error('Password cannot be empty!');

    const hashedPassword = await argon.hash(password);
    return hashedPassword;
  }
  async verifyPassword(password: string, hash: string): Promise<boolean> {
    return await argon.verify(hash, password);
  }
}
