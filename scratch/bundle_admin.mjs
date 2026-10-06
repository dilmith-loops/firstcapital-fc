import { build } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import path from 'path';

async function run() {
  try {
    const res = await build({
      base: './',
      configFile: false,
      plugins: [
        react(),
        tailwindcss(),
        tsconfigPaths()
      ],
      build: {
        outDir: 'firstcapitalpages/admin',
        emptyOutDir: true,
        rollupOptions: {
          input: {
            index: path.resolve('admin.html')
          }
        }
      }
    });
    console.log('Build success!');
  } catch (e) {
    console.error('Build error:', e);
  }
}

run();
