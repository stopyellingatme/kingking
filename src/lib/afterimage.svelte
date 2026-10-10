<script lang="ts">
	import { fillOf, shapes, type View } from '$lib/afterimage_scene';

	type Phase = 'ready' | 'stare' | 'test';

	let phase = $state<Phase>('ready');
	let seconds = $state(20);
	let left = $state(0);
	let turn = $state(0);
	let truth = $state(false);
	let timer: ReturnType<typeof setInterval> | undefined;

	// The swap from the stare picture to the grey picture must be instant, or the effect is weak.
	const view: View = $derived(truth ? 'colour' : phase === 'test' ? 'grey' : 'stare');

	function stop() {
		clearInterval(timer);
		timer = undefined;
	}

	function start() {
		stop();
		truth = false;
		phase = 'stare';
		const end = performance.now() + seconds * 1000;
		left = seconds;
		timer = setInterval(() => {
			left = Math.max(0, (end - performance.now()) / 1000);
			if (left > 0) return;
			stop();
			phase = 'test';
		}, 100);
	}

	function shuffle() {
		stop();
		phase = 'ready';
		turn = (turn + 60 + Math.random() * 240) % 360;
	}

	$effect(() => stop);

	const hint = $derived(
		{
			ready: 'Press START. Then look only at the black dot.',
			stare: 'Keep your eyes on the dot. Do not look away.',
			test: 'You see colour in a grey picture. Blink, and it comes back.'
		}[phase]
	);
</script>

<div class="flex flex-1 flex-col">
	<div class="flex flex-wrap items-center gap-x-6 gap-y-3 px-4 py-3 text-sm">
		{#if phase === 'stare'}
			<button type="button" class="btn w-24" onclick={shuffle}>STOP {Math.ceil(left)}</button>
		{:else}
			<button type="button" class="btn w-24" onclick={start}>START</button>
		{/if}
		<label class="flex items-center gap-2">
			TIME
			<input
				type="range"
				min="10"
				max="40"
				step="5"
				bind:value={seconds}
				disabled={phase === 'stare'}
				class="w-28"
			/>
			<span class="w-8 tabular-nums">{seconds}s</span>
		</label>
		<button type="button" class="btn" onclick={shuffle}>SHUFFLE</button>
		<button type="button" class="btn" aria-pressed={truth} onclick={() => (truth = !truth)}
			>TRUE COLOURS</button
		>
		<span class="opacity-70" aria-live="polite">{hint}</span>
	</div>

	<div class="relative min-h-80 flex-1 overflow-hidden">
		<svg
			class="absolute inset-0 h-full w-full"
			viewBox="0 0 400 300"
			preserveAspectRatio="xMidYMid slice"
			role="img"
			aria-label="A sunset over the sea"
			data-view={view}
		>
			{#each shapes as shape, i (i)}
				<svelte:element
					this={shape.kind}
					xmlns="http://www.w3.org/2000/svg"
					{...shape.attributes}
					fill={fillOf(shape, view, turn)}
				/>
			{/each}
			<circle cx="200" cy="150" r="4.5" fill="white" />
			<circle cx="200" cy="150" r="3" fill="black" />
		</svg>
		{#if phase === 'stare'}
			<div
				class="absolute bottom-0 left-0 h-1 bg-black dark:bg-white"
				style="width: {(left / seconds) * 100}%"
			></div>
		{/if}
	</div>
</div>
