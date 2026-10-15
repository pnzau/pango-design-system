import { resolve } from 'node:path'
import { readFile, writeFile } from 'node:fs/promises'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const external = [
  'react',
  'react-dom',
  'react/jsx-runtime',
  'lucide-react',
  'motion',
  'motion/react',
  'zod',
  '@dnd-kit/react',
  '@dnd-kit/react/sortable',
  '@dnd-kit/helpers',
  '@tanstack/charts/react',
  '@tanstack/react-form',
  '@tanstack/react-hotkeys',
  '@tanstack/react-table',
  '@tanstack/react-virtual',
]

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'pango-package-relative-fonts',
      async writeBundle() {
        const stylesheet = resolve(import.meta.dirname, 'dist-lib/styles.css')
        const source = await readFile(stylesheet, 'utf8')
        await writeFile(stylesheet, source.replaceAll(/url\((['"]?)\/fonts\//g, 'url($1./fonts/'))
      },
    },
  ],
  build: {
    outDir: 'dist-lib',
    emptyOutDir: true,
    cssMinify: 'esbuild',
    lib: {
      entry: {
        index: resolve(import.meta.dirname, 'src/index.ts'),
        styles: resolve(import.meta.dirname, 'src/styles.ts'),
        tokens: resolve(import.meta.dirname, 'src/tokens.ts'),
        forms: resolve(import.meta.dirname, 'src/forms.ts'),
        patterns: resolve(import.meta.dirname, 'src/patterns.ts'),
        table: resolve(import.meta.dirname, 'src/table.tsx'),
        virtual: resolve(import.meta.dirname, 'src/virtual.tsx'),
        dnd: resolve(import.meta.dirname, 'src/dnd.tsx'),
        charts: resolve(import.meta.dirname, 'src/charts.tsx'),
        hotkeys: resolve(import.meta.dirname, 'src/hotkeys.tsx'),
        motion: resolve(import.meta.dirname, 'src/motion.ts'),
      },
      formats: ['es'],
    },
    rollupOptions: {
      external,
      output: {
        entryFileNames: '[name].js',
        chunkFileNames: 'chunks/[name]-[hash].js',
        assetFileNames: (asset) => asset.name?.endsWith('.css') ? 'styles.css' : '[name][extname]',
      },
    },
  },
})
