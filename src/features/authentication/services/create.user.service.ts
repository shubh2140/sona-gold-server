import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository, FilterQuery } from '@mikro-orm/core';
import { HttpStatus, Injectable } from '@nestjs/common';
import errorConstants from '../../../core/constants/error.constants';
import successConstants from '../../../core/constants/success.constants';
import CreateUserDto from '../../../core/dto/create.user.dto';
import User from '../../../core/entities/user';
import ResponseInterface from '../../../core/interfaces/response.interface';
import serviceLocator from '../../../core/services/service.locator';
import PasswordHash from '../../../core/utils/security/password_hash/password.hash';

@Injectable()
export default class CreateUserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: EntityRepository<User>,
  ) {}

  async createUser(userData: CreateUserDto): Promise<ResponseInterface> {
    /**
     * Username is strict for user creation.
     *
     * Email, and Phone can be null. Filter the table using these identifiers if they not null!.
     */
    const userFilterQuery: FilterQuery<User>[] = [];
    userFilterQuery.push({ userName: userData.userName });
    if (userData.email) userFilterQuery.push({ email: userData.email });
    if (userData.phone) userFilterQuery.push({ phone: userData.phone });

    const findUser = await this.userRepository.findOne(userFilterQuery, {
      // Taking only id number
      exclude: [
        'createdAt',
        'email',
        'isLogged',
        'password',
        'phone',
        'role',
        'updatedAt',
        'userName',
      ],
    });

    if (findUser) {
      // User already exist!
      return {
        message: errorConstants.userAlreadyExist,
        statusCode: HttpStatus.CONFLICT,
        success: false,
      };
    }

    // User not found create a new one.

    // Hash password
    const passwordHash = await serviceLocator
      .resolve<PasswordHash>('argon')
      .hashPassword(userData.password);

    // Insert the user record
    await this.userRepository.insert({
      email: userData.email!,
      phone: userData.phone!,
      userName: userData.userName,
      role: userData.role,
      password: passwordHash,
      createdAt: new Date(),
      isLogged: true,
      updatedAt: new Date(),
    });

    // User registered successfully
    return {
      message: successConstants.userRegisteredSuccessfully,
      statusCode: HttpStatus.CREATED,
      success: true,
    };
  }
}
