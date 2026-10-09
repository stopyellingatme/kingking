<script lang="ts">
	import { page } from '$app/state';
</script>

<svelte:head>
	<title>{page.status} · TK</title>
</svelte:head>

<div class="flex flex-1 flex-col items-center justify-center gap-4 text-center">
	<h1 class="text-5xl">{page.status}</h1>
	<p class="text-xl">{page.status === 404 ? 'This page does not exist.' : page.error?.message}</p>
	<a href="/" class="underline">Go to the home page</a>
</div>
