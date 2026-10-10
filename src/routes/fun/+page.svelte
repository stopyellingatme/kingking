<script lang="ts">
	import { experiments } from '$lib/experiments';
	import Meta from '$lib/meta.svelte';
</script>

<Meta title="Space · TK" description="Experiments with colour, motion, and optical illusions." />

<div class="flex flex-1 items-center justify-center">
	<ul class="text-center text-3xl leading-loose sm:text-4xl">
		{#each experiments as experiment (experiment.slug)}
			<li><a href="/fun/{experiment.slug}">{experiment.name}</a></li>
		{/each}
	</ul>
</div>
