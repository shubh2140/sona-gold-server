import { asClass, createContainer } from 'awilix';
import PasswordHashWithArgon from '../utils/security/password_hash/password.hash.with.argon';
import PasswordHashWithBcrypt from '../utils/security/password_hash/password.hash.with.bcrypt';

const serviceLocator = createContainer();

// Core services
serviceLocator.register({
  // Argon implementation of password hashing
  argon: asClass(PasswordHashWithArgon),
  // Bcrypt implementation of password hashing
  bcrypt: asClass(PasswordHashWithBcrypt),
});

export default serviceLocator;
