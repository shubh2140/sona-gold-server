/**
 * Abstract interface to Hash password
 */
export default abstract class PasswordHash {
  /**
   *
   * @param password Password to hash
   *
   * @returns Hashed password.
   *
   * @throws Error if password is empty
   */
  abstract hashPassword(password: string): Promise<string>;

  /**
   *
   * @param password Password in plain text
   * @param hash Hashed password
   *
   * @returns Boolean, indicates that password is matching or not!.
   */
  abstract verifyPassword(password: string, hash: string): Promise<boolean>;
}
