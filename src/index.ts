import path from 'path';
import type { Plugin } from 'vite';
import { createMockMiddleware } from './middleware';

export interface MockOptions {
  mockDir?: string;
  delay?: number;
}

export default function vitePluginSimpleMock(options: MockOptions = {}): Plugin {
  const mockDir = options.mockDir || 'mock';
  const delay = options.delay || 0;

  return {
    name: 'vite-plugin-simple-mock',
    configureServer(server) {
      const mockPath = path.resolve(process.cwd(), mockDir);
      const middleware = createMockMiddleware(mockPath, delay);
      server.middlewares.use(middleware);
    },
  };
}
