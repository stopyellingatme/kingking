<script lang="ts">
	import { page } from '$app/state';
	import { experiments } from '$lib/experiments';

	let { children } = $props();

	const index = $derived(experiments.findIndex((e) => page.url.pathname === `/fun/${e.slug}`));
	const current = $derived(experiments[index]);
	const prev = $derived(experiments[(index - 1 + experiments.length) % experiments.length]);
	const next = $derived(experiments[(index + 1) % experiments.length]);
</script>

{@render children()}

{#if current}
	<nav
		class="flex items-center justify-between gap-4 border-t border-black px-4 py-3 dark:border-white"
		aria-label="Experiments"
	>
		<a href="/fun/{prev.slug}" class="shrink-0" aria-label="Previous: {prev.name}"
			>&#8249; {prev.name}</a
		>
		<p class="hidden text-center text-sm opacity-70 md:block">{current.note}</p>
		<a href="/fun/{next.slug}" class="shrink-0" aria-label="Next: {next.name}"
			>{next.name} &#8250;</a
		>
	</nav>
{/if}
