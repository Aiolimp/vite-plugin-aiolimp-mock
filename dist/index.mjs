var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
  get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
}) : x)(function(x) {
  if (typeof require !== "undefined") return require.apply(this, arguments);
  throw Error('Dynamic require of "' + x + '" is not supported');
});

// src/index.ts
import path2 from "path";

// src/middleware.ts
import fs from "fs";
import path from "path";
function createMockMiddleware(mockPath, delay) {
  return async (req, res, next) => {
    const url = req.url?.split("?")[0];
    const method = req.method?.toLowerCase();
    if (!url || !method) return next();
    const filePath = path.join(mockPath, `${url.replace(/^\/api\//, "")}.ts`);
    if (!fs.existsSync(filePath)) return next();
    try {
      delete __require.cache[__require.resolve(filePath)];
      const mod = __require(filePath);
      const handler = mod[method];
      if (!handler) return next();
      const result = await handler(req);
      setTimeout(() => {
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify(result));
      }, delay);
    } catch (err) {
      console.error(`[mock error] ${err}`);
      res.statusCode = 500;
      res.end(`Mock Error: ${err}`);
    }
  };
}

// src/index.ts
function vitePluginSimpleMock(options = {}) {
  const mockDir = options.mockDir || "mock";
  const delay = options.delay || 0;
  return {
    name: "vite-plugin-simple-mock",
    configureServer(server) {
      const mockPath = path2.resolve(process.cwd(), mockDir);
      const middleware = createMockMiddleware(mockPath, delay);
      server.middlewares.use(middleware);
    }
  };
}
export {
  vitePluginSimpleMock as default
};
