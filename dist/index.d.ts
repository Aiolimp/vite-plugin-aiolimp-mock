import { Plugin } from 'vite';

interface MockOptions {
    mockDir?: string;
    delay?: number;
}
declare function vitePluginSimpleMock(options?: MockOptions): Plugin;

export { type MockOptions, vitePluginSimpleMock as default };
