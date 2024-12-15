// @ts-check
import { defineConfig } from 'astro/config';

import svelte from '@astrojs/svelte';
import vercel from '@astrojs/vercel';
import unocss from 'unocss/astro'
import db from '@astrojs/db';

// https://astro.build/config
export default defineConfig({
  integrations: [svelte(), unocss({ injectReset: true }), db()],
  adapter: vercel()
});