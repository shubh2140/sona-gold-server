import { config } from 'dotenv';
import * as jwt from 'jsonwebtoken';

config({ path: '.env' });

export function generateTestToken(payload: any): string {
  return jwt.sign(payload, process.env.JWT_SECRET!);
}
