import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
export default defineConfig({ plugins: [react(), {
    name: 'returnwindow-production-csp',
    apply: 'build',
    transformIndexHtml: {
        order: 'pre',
        handler: () => [{ tag: 'meta', attrs: {
            'http-equiv': 'Content-Security-Policy',
            content: "default-src 'self'; script-src 'self' 'wasm-unsafe-eval'; worker-src 'self' blob:; connect-src 'self' blob: data:; img-src 'self' blob: data:; style-src 'self' 'unsafe-inline'; object-src 'none'; base-uri 'none'; form-action 'none'",
        }, injectTo: 'head-prepend' }],
    },
}] });
