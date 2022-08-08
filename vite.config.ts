import { rmSync } from 'fs'
import { fileURLToPath, URL } from 'url'
import { join } from 'path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import electron from 'vite-plugin-electron'
import pkg from './package.json'

rmSync('dist', { recursive: true, force: true }) // v14.14.0


// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        vue(),
        electron({
            main: {
                entry: 'electron/main/index.ts',
                vite: {
                    build: {
                        outDir: 'dist/electron/main',
                    },
                },
            },
            preload: {
                input: {
                    // 您可以在此处配置多个预加载
                    index: join(__dirname, 'electron/preload/index.ts'),
                },
                vite: {
                    build: {
                        // For debug
                        sourcemap: 'inline',
                        outDir: 'dist/electron/preload',
                    },
                },
            },
            // 允许在渲染器进程中使用 Node.js API
            renderer: {},
        }),
    ],
    server: {
        host: pkg.env.VITE_DEV_SERVER_HOST,
        port: pkg.env.VITE_DEV_SERVER_PORT,
    },
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url)),
        },
    }
})


