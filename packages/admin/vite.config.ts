import {resolve} from 'path';
import {defineConfig} from 'vite';

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: '@junobuild/admin',
      fileName: 'index'
    },
    sourcemap: true
  }
});
