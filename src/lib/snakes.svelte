<script lang="ts">
	import { drawSnakes, schemes } from '$lib/snake_pattern';

	let canvas: HTMLCanvasElement;
	let scheme = $state(0);
	// The number of large discs across the short side of the canvas.
	let discs = $state(3);
	let flip = $state(false);

	// The picture does not change on each frame. Draw it again only when a value or the size changes.
	$effect(() => {
		const colours = schemes[scheme].colours;
		const across = discs;
		const turned = flip;
		let frame = 0;

		const draw = () => {
			frame = 0;
			const width = canvas.clientWidth;
			const height = canvas.clientHeight;
			drawSnakes(canvas, {
				width,
				height,
				ratio: devicePixelRatio,
				cell: Math.min(width, height) / across,
				colours,
				flip: turned
			});
		};

		const observer = new ResizeObserver(() => {
			if (!frame) frame = requestAnimationFrame(draw);
		});
		observer.observe(canvas);
		return () => {
			observer.disconnect();
			cancelAnimationFrame(frame);
		};
	});
</script>

<div class="flex flex-1 flex-col">
	<div class="flex flex-wrap items-center gap-x-6 gap-y-3 px-4 py-3 text-sm">
		<div class="flex flex-wrap gap-2" role="group" aria-label="Colours">
			{#each schemes as item, i (item.name)}
				<button
					type="button"
					class="btn flex items-center gap-2"
					aria-pressed={scheme === i}
					onclick={() => (scheme = i)}
				>
					<span class="flex" aria-hidden="true">
						{#each item.colours as colour (colour)}
							<span class="h-3 w-1.5" style="background: {colour}"></span>
						{/each}
					</span>
					{item.name}
				</button>
			{/each}
		</div>
		<label class="flex items-center gap-2">
			DISCS
			<input type="range" min="1" max="8" step="1" bind:value={discs} class="w-28" />
		</label>
		<button type="button" class="btn" aria-pressed={flip} onclick={() => (flip = !flip)}
			>FLIP</button
		>
		<span class="opacity-70">Nothing here moves. Look at one point, and the discs stop.</span>
	</div>

	<div class="relative min-h-80 flex-1">
		<canvas
			bind:this={canvas}
			class="absolute inset-0 h-full w-full cursor-pointer"
			aria-label="Discs of colour that seem to turn"
			data-scheme={schemes[scheme].name}
			onclick={() => (flip = !flip)}
		></canvas>
	</div>
</div>
