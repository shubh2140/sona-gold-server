import type { IncomingMessage, ServerResponse } from 'http';
import { createApp } from '../src/main';

let cachedServer: ((req: IncomingMessage, res: ServerResponse) => void) | undefined;

async function getServer(): Promise<(req: IncomingMessage, res: ServerResponse) => void> {
  if (!cachedServer) {
    const app = await createApp();
    await app.init();
    cachedServer = app.getHttpAdapter().getInstance();
  }

  return cachedServer!;
}

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  const server = await getServer();
  server(req, res);
}
