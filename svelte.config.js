import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

// Note: don't force `runes: true` globally — that breaks legacy components in
// dependencies (e.g. lucide-svelte's Icon uses `$$props`). Svelte 5 auto-detects
// runes mode per-file when you use a rune like `$state`/`$props`/`$derived`.
export default {
  preprocess: vitePreprocess(),
};
