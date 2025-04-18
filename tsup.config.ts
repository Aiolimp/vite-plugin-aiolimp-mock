import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm'],
  dts: true, // 生成 .d.ts 类型声明
  clean: true, // 清理旧文件
  outDir: 'dist',
});
