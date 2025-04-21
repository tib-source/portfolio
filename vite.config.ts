import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { imagetools } from 'vite-imagetools';

export default defineConfig({
	plugins: [
		imagetools(), // Add image optimization
		sveltekit()
	],
	build: {
		// Improve chunking strategy
		rollupOptions: {
			output: {
				manualChunks: {
					vendor: ['svelte', 'svelte/transition', 'svelte/store', 'svelte/motion']
				}
			}
		},
		// Enable CSS code splitting
		cssCodeSplit: true,
		// Minify output
		minify: 'terser',
		// Use modern browser targeting
		target: 'esnext',
		// Reduce chunk size warnings
		chunkSizeWarningLimit: 1000
	},
	// Optimize dependencies
	optimizeDeps: {
		include: ['clsx', 'tailwind-merge']
	},
	// Enable source maps in production for easier debugging
	css: {
		devSourcemap: true,
		preprocessorOptions: {
			scss: {
			  api: 'modern-compiler' // or "modern"
			}
		}
	},
	// Speed up server startup
	server: {
		fs: {
			strict: false
		}
	}
});
