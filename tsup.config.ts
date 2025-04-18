import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'], // 插件入口
  format: ['esm', 'cjs'], // 同时打包为 ESModule 和 CommonJS
  dts: true, // 生成 index.d.ts
  splitting: false, // 不进行代码分割（插件不需要）
  sourcemap: false, // 是否需要 sourcemap，看你是否调试需要
  clean: true, // 构建前清除 dist
  outDir: 'dist', // 输出目录
  target: 'esnext', // 保留现代语法
});
