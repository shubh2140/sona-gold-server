import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export default class LoginUserDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  identifier: string;

  @ApiProperty({ minLength: 8, type: 'string' })
  @IsString()
  @MinLength(8)
  password: string;
}
