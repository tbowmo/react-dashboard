/* eslint-disable import/no-extraneous-dependencies */
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
    plugins: [react()],
    server: {
        proxy: {
            '/weather': 'http://localhost:5000',
            '/api': 'http://localhost:5000',
            '/media': 'http://localhost:5000',
            '/deviceSet': 'http://localhost:5000',
            '/surveilance': 'http://localhost:5000',
            '/remote': 'http://localhost:5000',
        },
    },
})
