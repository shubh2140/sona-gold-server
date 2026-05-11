import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export default class TokenGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const token = this.getToken(request);

    if (!token) {
      // Token not found
      throw new UnauthorizedException({
        message: 'Unauthorized',
        statusCode: 401,
        success: false,
      });
    }

    try {
      const payload = this.jwtService.verify(token, {
        secret:
          '%}c8%|/-@T8UM|>I}9?4;}OH9-}.ANN-(iJs1>,r#ZoIv8*894B_Vjnh.LM53TL>8:2@Z{-7MW0y3+KgY!4jMg',
      });
      /**
       * Assumes that, the payload comes in this form
       *
       * {
       *    id: 1,
       *    role: 'admin'
       * }
       */
      request['user'] = payload;
    } catch {
      throw new UnauthorizedException({
        message: 'Unauthorized',
        statusCode: 401,
        success: false,
      });
    }
    return true;
  }

  private getToken(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
