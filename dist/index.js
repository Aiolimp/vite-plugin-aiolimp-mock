"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var index_exports = {};
__export(index_exports, {
  default: () => vitePluginSimpleMock
});
module.exports = __toCommonJS(index_exports);
var import_path2 = __toESM(require("path"));

// src/middleware.ts
var import_fs = __toESM(require("fs"));
var import_path = __toESM(require("path"));
function createMockMiddleware(mockPath, delay) {
  return async (req, res, next) => {
    const url = req.url?.split("?")[0];
    const method = req.method?.toLowerCase();
    if (!url || !method) return next();
    const filePath = import_path.default.join(mockPath, `${url.replace(/^\/api\//, "")}.ts`);
    if (!import_fs.default.existsSync(filePath)) return next();
    try {
      delete require.cache[require.resolve(filePath)];
      const mod = require(filePath);
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
      const mockPath = import_path2.default.resolve(process.cwd(), mockDir);
      const middleware = createMockMiddleware(mockPath, delay);
      server.middlewares.use(middleware);
    }
  };
}
