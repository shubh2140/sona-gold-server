import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
  MinLength,
} from 'class-validator';
import { UserRole } from '../enums/user.role.enum';

export default class CreateUserDto {
  @ApiProperty({ nullable: true, type: 'string' })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({ nullable: true, type: 'string' })
  @IsOptional()
  @IsPhoneNumber()
  phone?: string;

  @ApiProperty({ enum: UserRole })
  @IsEnum(UserRole)
  role: UserRole;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  userName: string;

  @ApiProperty({ minLength: 8 })
  @IsNotEmpty()
  @IsString()
  // Password must be greater than 8 characters long
  @MinLength(8)
  password: string;
}
