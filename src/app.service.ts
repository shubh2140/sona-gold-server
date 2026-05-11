import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getServerStatus() {
    return {
      success: true,
      statusCode: 200,
      message: 'Server is live',
    };
  }
}
