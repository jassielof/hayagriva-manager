import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { SvelteKitPWA } from '@vite-pwa/sveltekit';
import { defineConfig } from 'vite';

/** @type {import('vite').UserConfig} */
export default defineConfig({
  plugins: [tailwindcss(), sveltekit(), SvelteKitPWA()]
});
