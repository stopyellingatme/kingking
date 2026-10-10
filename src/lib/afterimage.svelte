<script lang="ts">
	import { bodyAt, moveBodies, tracker, type Body } from '$lib/bodies';
	import { animate, reducedMotion } from '$lib/motion';
	import { orbColours, stareColours } from '$lib/orbs';

	type Phase = 'ready' | 'stare' | 'after';

	interface Orb extends Body {
		colour: number;
		phase: number;
	}

	let orbs: Orb[] = $state([]);
	let width = $state(0);
	let height = $state(0);
	let phase = $state<Phase>('ready');
	let seconds = $state(20);
	let left = $state(0);
	let truth = $state(false);
	let timer: ReturnType<typeof setInterval> | undefined;
	let held: Orb | undefined;
	let grip = { x: 0, y: 0 };
	const motion = tracker();

	function scatter() {
		const short = Math.min(width, height);
		const first = Math.floor(Math.random() * orbColours.length);
		// Put the orbs near the dot. The afterimage is strongest near the point you look at.
		orbs = orbColours.map((_, i) => {
			const r = short * (0.11 + Math.random() * 0.08);
			const angle = (i / orbColours.length) * Math.PI * 2 + Math.random() * 0.6;
			const reach = short * (0.12 + Math.random() * 0.2);
			return {
				x: width / 2 + Math.cos(angle) * reach * (width / short) ** 0.5,
				y: height / 2 + Math.sin(angle) * reach,
				vx: 0,
				vy: 0,
				r,
				colour: (first + i) % orbColours.length,
				phase: Math.random() * Math.PI * 2
			};
		});
	}

	$effect(() => {
		const calm = reducedMotion();
		return animate((dt, time) => {
			// The orbs stay still from START to the end, so the outlines are where the orbs were.
			if (phase !== 'ready') return;
			for (const orb of orbs) {
				if (calm || orb === held) continue;
				// A slow push in a direction that changes over time, so the orbs float.
				orb.vx += Math.cos(time * 0.4 + orb.phase) * 30 * dt;
				orb.vy += Math.sin(time * 0.3 + orb.phase * 1.7) * 30 * dt;
			}
			moveBodies(orbs, dt, { width, height, held, friction: 0.9, bounce: 0.8 });
		});
	});

	// Make the orbs when the size is first known. Later, move them with the size.
	let known = { width: 0, height: 0 };
	$effect(() => {
		if (width === 0 || height === 0) return;
		if (orbs.length === 0) scatter();
		else if (known.width && known.height) {
			const size = Math.min(width, height) / Math.min(known.width, known.height);
			for (const orb of orbs) {
				orb.x *= width / known.width;
				orb.y *= height / known.height;
				orb.r *= size;
			}
		}
		known = { width, height };
	});

	function stop() {
		clearInterval(timer);
		timer = undefined;
	}

	function start() {
		stop();
		truth = false;
		held = undefined;
		for (const orb of orbs) orb.vx = orb.vy = 0;
		phase = 'stare';
		const end = performance.now() + seconds * 1000;
		left = seconds;
		timer = setInterval(() => {
			left = Math.max(0, (end - performance.now()) / 1000);
			if (left > 0) return;
			stop();
			// This change must be instant. A fade makes the effect weak.
			phase = 'after';
		}, 50);
	}

	function cancel() {
		stop();
		phase = 'ready';
	}

	function shuffle() {
		cancel();
		scatter();
	}

	$effect(() => stop);

	function local(event: PointerEvent) {
		const box = (event.currentTarget as Element).getBoundingClientRect();
		return { x: event.clientX - box.left, y: event.clientY - box.top };
	}

	function down(event: PointerEvent) {
		if (phase === 'stare') return;
		const point = local(event);
		const hit = bodyAt(orbs, point.x, point.y);
		if (!hit) return;
		if (phase === 'after') phase = 'ready';
		held = hit;
		grip = { x: point.x - hit.x, y: point.y - hit.y };
		hit.vx = hit.vy = 0;
		motion.start(point.x, point.y);
		(event.currentTarget as Element).setPointerCapture(event.pointerId);
	}

	function move(event: PointerEvent) {
		if (!held) return;
		const point = local(event);
		held.x = point.x - grip.x;
		held.y = point.y - grip.y;
		motion.move(point.x, point.y);
	}

	function up() {
		if (!held) return;
		const { vx, vy } = motion.end();
		held.vx = vx;
		held.vy = vy;
		held = undefined;
	}

	const view = $derived(truth ? 'colour' : phase === 'after' ? 'outline' : 'stare');
	const ring = 2 * Math.PI * 12;

	const hint = $derived(
		{
			ready: 'Drag the orbs where you like. Then press START and look only at the dot.',
			stare: 'Keep your eyes on the dot. Do not look away.',
			after: 'Keep looking at the dot. Your eyes fill the outlines with colour.'
		}[phase]
	);
</script>

<div class="flex flex-1 flex-col">
	<div class="flex flex-wrap items-center gap-x-6 gap-y-3 px-4 py-3 text-sm">
		{#if phase === 'stare'}
			<button type="button" class="btn w-24" onclick={cancel}>STOP {Math.ceil(left)}</button>
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
				class="w-24"
			/>
			<span class="w-8 tabular-nums">{seconds}s</span>
		</label>
		<button type="button" class="btn" onclick={shuffle}>SHUFFLE</button>
		<button type="button" class="btn" aria-pressed={truth} onclick={() => (truth = !truth)}
			>TRUE COLOURS</button
		>
		<span class="opacity-70" aria-live="polite">{hint}</span>
	</div>

	<div
		class="relative min-h-80 flex-1 touch-none overflow-hidden"
		role="presentation"
		bind:clientWidth={width}
		bind:clientHeight={height}
		onpointerdown={down}
		onpointermove={move}
		onpointerup={up}
		onpointercancel={up}
	>
		<svg
			class="absolute inset-0 h-full w-full"
			viewBox="0 0 {width || 1} {height || 1}"
			role="img"
			aria-label="Soft orbs of colour around a dot"
			data-view={view}
		>
			<defs>
				{#each orbs as orb, i (i)}
					{@const [edge, light] =
						view === 'colour' ? orbColours[orb.colour] : stareColours(orbColours[orb.colour])}
					<radialGradient id="orb-{i}" cx="35%" cy="30%" r="75%">
						<stop offset="0" stop-color={light} />
						<stop offset="1" stop-color={edge} />
					</radialGradient>
				{/each}
			</defs>
			{#each orbs as orb, i (i)}
				{#if view === 'outline'}
					<circle
						cx={orb.x}
						cy={orb.y}
						r={orb.r}
						fill="none"
						stroke="currentColor"
						stroke-opacity="0.45"
						stroke-width="1.5"
					/>
				{:else}
					<circle class="cursor-grab" cx={orb.x} cy={orb.y} r={orb.r} fill="url(#orb-{i})" />
				{/if}
			{/each}
			<g transform="translate({width / 2} {height / 2})">
				<circle r="5" class="fill-white" />
				<circle r="3.5" class="fill-black" />
				{#if phase === 'stare'}
					<circle
						r="12"
						fill="none"
						stroke="currentColor"
						stroke-opacity="0.5"
						stroke-width="1.5"
						stroke-dasharray={ring}
						stroke-dashoffset={ring * (1 - left / seconds)}
						transform="rotate(-90)"
					/>
				{/if}
			</g>
		</svg>
	</div>
</div>
