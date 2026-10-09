<script lang="ts">
	import Meta from '$lib/meta.svelte';
	import { animate, approach, reducedMotion } from '$lib/motion';

	// The pointer position over the page, from 0 to 1. The light follows it slowly.
	let target = { x: 0.5, y: 0.35 };
	let light = $state({ x: 0.5, y: 0.35 });

	$effect(() => {
		if (reducedMotion()) return;
		return animate((dt) => {
			light.x = approach(light.x, target.x, 4, dt);
			light.y = approach(light.y, target.y, 4, dt);
		});
	});

	function follow(event: PointerEvent) {
		const box = (event.currentTarget as HTMLElement).getBoundingClientRect();
		target = {
			x: (event.clientX - box.left) / box.width,
			y: (event.clientY - box.top) / box.height
		};
	}

	const tilt = $derived(`rotateX(${(0.5 - light.y) * 10}deg) rotateY(${(light.x - 0.5) * 14}deg)`);
</script>

<Meta
	title="M1 · TK"
	description="A conic gradient turns slowly and glows behind the TK letters. The light follows your pointer."
/>

<div
	class="flex flex-1 items-center justify-center overflow-hidden py-12 perspective-[1000px]"
	role="presentation"
	onpointermove={follow}
	onpointerleave={() => (target = { x: 0.5, y: 0.35 })}
>
	<div
		class="animate-tk-spin relative aspect-[24/25] w-[min(24rem,70vw)]"
		style="transform: {tilt}"
	>
		<div
			class="absolute z-10 flex h-full w-full items-center justify-center"
			style="background: radial-gradient(circle at {light.x * 100}% {light.y *
				100}%, rgb(255 255 255 / 0.1), transparent 45%), linear-gradient(to bottom right, var(--color-gray-900), var(--color-black))"
		>
			<h1 class="tk-sheen animate-tk-sheen -mt-2 text-8xl font-bold">TK</h1>
		</div>
		<div class="bg-tk-conic absolute h-full w-full blur-xl"></div>
		<div class="bg-tk-conic absolute h-full w-full animate-pulse opacity-60 blur-3xl"></div>
		<div class="bg-tk-conic absolute -inset-0.5 rounded-xs"></div>
	</div>
</div>
