import fs from 'fs';
import path from 'path';
import type { Connect } from 'vite';

export function createMockMiddleware(mockPath: string, delay: number): Connect.NextHandleFunction {
  return async (req, res, next) => {
    const url = req.url?.split('?')[0];
    const method = req.method?.toLowerCase();

    if (!url || !method) return next();

    const filePath = path.join(mockPath, `${url.replace(/^\/api\//, '')}.ts`);

    if (!fs.existsSync(filePath)) return next();

    try {
      delete require.cache[require.resolve(filePath)];
      const mod = require(filePath);
      const handler = mod[method];

      if (!handler) return next();

      const result = await handler(req);

      setTimeout(() => {
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(result));
      }, delay);
    } catch (err) {
      console.error(`[mock error] ${err}`);
      res.statusCode = 500;
      res.end(`Mock Error: ${err}`);
    }
  };
}
