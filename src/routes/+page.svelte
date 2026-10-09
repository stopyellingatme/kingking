<script lang="ts">
	import { experiments } from '$lib/experiments';
	import Meta from '$lib/meta.svelte';
	import Preview from '$lib/preview.svelte';
</script>

<Meta title="TK" description="The personal site of Taylor King. Art projects and experiments." />

<div class="flex flex-1 flex-col items-center gap-12 px-4 py-12">
	<div class="flex cursor-crosshair flex-col items-center text-center text-5xl select-none">
		<div class="flex items-center justify-center py-2" aria-hidden="true">
			&#8249;
			<div class="opti-01 mx-6 mt-2 h-[2px] w-40 rounded"></div>
			&#8250;
		</div>
		<h1 class="py-2">&#8594;&nbsp;T K&nbsp;&#8592;</h1>
		<div class="flex items-center justify-center py-2" aria-hidden="true">
			&#8249;
			<div class="opti-02 mx-6 mt-2 h-[2px] w-40 rounded"></div>
			&#8250;
		</div>
	</div>

	<ul class="grid w-full max-w-5xl grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-4">
		{#each experiments as experiment (experiment.slug)}
			<li>
				<a
					href="/fun/{experiment.slug}"
					class="group flex h-full flex-col border border-black transition-colors hover:border-transparent dark:border-white dark:hover:border-transparent"
				>
					<div class="relative aspect-square bg-white dark:bg-black">
						<Preview slug={experiment.slug} />
					</div>
					<div class="opti-01 h-[2px] opacity-0 transition-opacity group-hover:opacity-100"></div>
					<div class="flex flex-1 flex-col gap-2 p-3">
						<h2 class="text-sm sm:text-lg">&#8594; {experiment.name}</h2>
						<p class="text-xs opacity-70 sm:text-sm">{experiment.note}</p>
					</div>
				</a>
			</li>
		{/each}
	</ul>
</div>
