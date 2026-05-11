import * as bcrypt from 'bcrypt';
import PasswordHash from './password.hash';

export default class PasswordHashWithBcrypt implements PasswordHash {
  async hashPassword(password: string): Promise<string> {
    if (password.length == 0) throw new Error('Password cannot be empty!');

    const hashedPassword = await bcrypt.hash(password, 10);
    return hashedPassword;
  }
  async verifyPassword(password: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(password, hash);
  }
}
