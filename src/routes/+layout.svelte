<script lang="ts">
	import '../app.css';
	import Header from '$lib/header.svelte';

	let { children } = $props();
</script>

<div class="flex min-h-dvh flex-col">
	<Header />

	<div class="flex h-8 items-center justify-center text-2xl" aria-hidden="true">
		&#8249;&nbsp;
		<div class="opti-01 mt-1 h-[2px] w-full"></div>
		&nbsp;&#8250;
	</div>

	<div class="flex flex-1">
		<div class="flex flex-col items-center justify-center text-2xl" aria-hidden="true">
			&#8593;
			<div class="w-px flex-1 border border-black dark:border-white"></div>
			&#8595;
		</div>
		<main class="flex w-full min-w-0 flex-col">
			{@render children()}
		</main>
		<div class="flex flex-col items-center justify-center text-2xl" aria-hidden="true">
			&#8593;
			<div class="w-px flex-1 border border-black dark:border-white"></div>
			&#8595;
		</div>
	</div>
</div>
