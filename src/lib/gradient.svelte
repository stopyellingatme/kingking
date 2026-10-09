<script lang="ts">
	import { flip } from 'svelte/animate';
	import { backOut } from 'svelte/easing';
	import { scale } from 'svelte/transition';
	import { animate } from '$lib/motion';
	import { palette } from '$lib/palette';

	type Kind = 'linear' | 'radial' | 'conic';

	let nextId = 0;
	const stop = (value: string) => ({ id: nextId++, value });

	let colors = $state(palette.map(stop));
	let kind = $state<Kind>('linear');
	let angle = $state(90);
	let centre = $state({ x: 50, y: 50 });
	let spin = $state(false);
	let picked = $state('#ffffff');
	let copied = $state(false);
	let steering = false;

	// A gradient needs two colours or more.
	const list = $derived(
		colors.length === 1
			? `${colors[0].value}, ${colors[0].value}`
			: colors.map((c) => c.value).join(', ')
	);
	const css = $derived.by(() => {
		const turn = Math.round(angle);
		if (kind === 'radial') {
			return `radial-gradient(circle at ${Math.round(centre.x)}% ${Math.round(centre.y)}%, ${list})`;
		}
		if (kind === 'conic') return `conic-gradient(from ${turn}deg, ${list})`;
		return `linear-gradient(${turn}deg, ${list})`;
	});

	$effect(() => {
		if (!spin) return;
		return animate((dt) => (angle = (angle + dt * 45) % 360));
	});

	// Point the gradient at the pointer, or move the centre of a radial gradient to the pointer.
	function steer(event: PointerEvent) {
		const box = (event.currentTarget as HTMLElement).getBoundingClientRect();
		const x = event.clientX - box.left;
		const y = event.clientY - box.top;
		if (kind === 'radial') {
			centre = {
				x: Math.min(100, Math.max(0, (x / box.width) * 100)),
				y: Math.min(100, Math.max(0, (y / box.height) * 100))
			};
		} else {
			const degrees = (Math.atan2(x - box.width / 2, box.height / 2 - y) * 180) / Math.PI;
			angle = (degrees + 360) % 360;
		}
	}

	function hex(hue: number, saturation: number, lightness: number) {
		const a = saturation * Math.min(lightness, 1 - lightness);
		const channel = (n: number) => {
			const k = (n + hue / 30) % 12;
			const value = lightness - a * Math.max(-1, Math.min(k - 3, 9 - k, 1));
			return Math.round(value * 255)
				.toString(16)
				.padStart(2, '0');
		};
		return `#${channel(0)}${channel(8)}${channel(4)}`;
	}

	// Make a new set of colours that start at a random hue and turn around the colour wheel.
	function shuffle() {
		const start = Math.random() * 360;
		const reach = 60 + Math.random() * 240;
		const size = 4 + Math.floor(Math.random() * 5);
		colors = Array.from({ length: size }, (_, i) =>
			stop(
				hex(
					(start + (reach * i) / (size - 1)) % 360,
					0.6 + Math.random() * 0.4,
					0.3 + Math.random() * 0.45
				)
			)
		);
	}

	async function copy() {
		try {
			await navigator.clipboard.writeText(`background-image: ${css};`);
			copied = true;
			setTimeout(() => (copied = false), 1500);
		} catch {
			// Some browsers block the clipboard. The CSS is also on the page.
		}
	}
</script>

<div class="flex flex-col gap-4">
	<div
		class="h-48 cursor-crosshair touch-none rounded sm:h-64"
		style="background-image: {css}"
		role="presentation"
		onpointerdown={(event) => {
			(event.currentTarget as HTMLElement).setPointerCapture(event.pointerId);
			steering = true;
			steer(event);
		}}
		onpointermove={(event) => steering && steer(event)}
		onpointerup={() => (steering = false)}
		onpointercancel={() => (steering = false)}
	></div>

	<p class="text-sm opacity-70">
		{kind === 'radial'
			? 'Drag in the box to move the centre.'
			: 'Drag in the box to point the gradient.'}
	</p>

	<div class="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm">
		<div class="flex" role="group" aria-label="Gradient type">
			{#each ['linear', 'radial', 'conic'] as const as option (option)}
				<button
					type="button"
					class="btn -ml-px first:ml-0"
					aria-pressed={kind === option}
					onclick={() => (kind = option)}>{option.toUpperCase()}</button
				>
			{/each}
		</div>
		{#if kind !== 'radial'}
			<label class="flex items-center gap-2">
				ANGLE
				<input type="range" min="0" max="359" bind:value={angle} class="w-32 accent-current" />
				<span class="w-10 tabular-nums">{Math.round(angle)}°</span>
			</label>
			<button type="button" class="btn" aria-pressed={spin} onclick={() => (spin = !spin)}
				>SPIN</button
			>
		{/if}
		<button type="button" class="btn" onclick={() => colors.reverse()}>REVERSE</button>
		<button type="button" class="btn" onclick={shuffle}>SHUFFLE</button>
		<button type="button" class="btn" onclick={copy}>{copied ? 'COPIED' : 'COPY CSS'}</button>
	</div>

	<ul class="flex flex-wrap gap-2" aria-label="Colours">
		{#each colors as color, i (color.id)}
			<li
				class="flex items-center rounded border border-gray-300 dark:border-gray-700"
				animate:flip={{ duration: 400, easing: backOut }}
				transition:scale={{ duration: 300, easing: backOut, start: 0.3 }}
			>
				<input
					type="color"
					class="h-8 w-10 cursor-pointer bg-transparent"
					aria-label="Colour {i + 1}"
					bind:value={color.value}
				/>
				<button
					type="button"
					class="cursor-pointer px-2 disabled:cursor-default disabled:opacity-30"
					aria-label="Remove colour {i + 1}"
					disabled={colors.length <= 2}
					onclick={() => colors.splice(i, 1)}>×</button
				>
			</li>
		{/each}
		<li class="flex items-center gap-1 rounded border border-dashed border-current px-1">
			<input
				type="color"
				class="h-8 w-10 cursor-pointer bg-transparent"
				aria-label="New colour"
				bind:value={picked}
			/>
			<button
				type="button"
				class="cursor-pointer px-1 text-sm"
				onclick={() => colors.push(stop(picked))}>+ ADD</button
			>
		</li>
	</ul>

	<code class="block text-xs break-all opacity-70">background-image: {css};</code>
</div>
