import serviceLocator from '../../../../../src/core/services/service.locator';
import PasswordHash from '../../../../../src/core/utils/security/password_hash/password.hash';

describe('Password hash test', () => {
  let passwordHash: PasswordHash;

  beforeAll(() => {
    // Assign Argon implementation to passwordHash
    passwordHash = serviceLocator.resolve<PasswordHash>('argon');
  });

  it('Should return false as password not matching', async () => {
    const password = 'password';
    const hash = await passwordHash.hashPassword(password);
    const isPasswordMatching = await passwordHash.verifyPassword('pass', hash);
    expect(isPasswordMatching).toEqual(false);
  });

  it('Should return true as password matching', async () => {
    const password = 'password';
    const hash = await passwordHash.hashPassword(password);
    const isPasswordMatching = await passwordHash.verifyPassword(
      password,
      hash,
    );
    expect(isPasswordMatching).toEqual(true);
  });
});
