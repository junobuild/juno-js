import {resolve} from 'path';
import {readFileSync} from "fs";
import {join} from 'path';
import type {UserConfigExport} from "vite";

export const viteConfig = (): UserConfigExport => {
  const file = join(process.cwd(), "package.json");
  const json = readFileSync(file, "utf8");
  const { name } = JSON.parse(json);

  return {
    build: {
      lib: {
        entry: resolve(process.cwd(), 'src/index.ts'),
        name,
        fileName: 'index'
      },
      sourcemap: true
    }
  }
}
