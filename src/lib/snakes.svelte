<script lang="ts">
	import { bodyAt, moveBodies, tracker, type Body } from '$lib/bodies';
	import { animate } from '$lib/motion';
	import { GLOW, renderDisc, schemes } from '$lib/snake_pattern';

	interface Disc extends Body {
		angle: number;
		// The real turn speed, in radians each second. Friction stops it, but the eye still sees a turn.
		spin: number;
		scheme: number;
		// Next to each other, discs seem to turn in opposite directions.
		mirror: boolean;
		// A spring on the size, so a disc bounces when you pick it up.
		scale: number;
		grow: number;
		image?: HTMLCanvasElement;
	}

	let canvas: HTMLCanvasElement;
	// The discs change on each frame. They are not Svelte state, so only the canvas updates.
	let discs: Disc[] = [];
	let count = $state(0);
	let flip = $state(false);
	let width = 0;
	let height = 0;
	let ratio = 1;
	let held: Disc | undefined;
	let grip = { x: 0, y: 0 };
	let press = { x: 0, y: 0 };
	const motion = tracker();

	function scatter() {
		const short = Math.min(width, height);
		const total = Math.max(3, Math.min(7, Math.round((width * height) / 100000)));
		const first = Math.floor(Math.random() * schemes.length);
		const next: Disc[] = [];
		for (let tries = 0; next.length < total && tries < 3000; tries++) {
			const r = Math.max(45, short * (0.13 + Math.random() * 0.1));
			const x = r + Math.random() * Math.max(0, width - 2 * r);
			const y = r + Math.random() * Math.max(0, height - 2 * r);
			// Late tries can overlap a little, so a small canvas still gets its discs.
			const space = tries < 2000 ? 8 : -r * 0.5;
			if (next.some((d) => Math.hypot(d.x - x, d.y - y) < d.r + r + space)) continue;
			next.push({
				x,
				y,
				r,
				vx: 0,
				vy: 0,
				angle: Math.random() * Math.PI * 2,
				spin: 0,
				scheme: (first + next.length) % schemes.length,
				mirror: next.length % 2 === 1,
				scale: 0.2,
				grow: 0
			});
		}
		discs = next;
		count = discs.length;
		render();
	}

	function render() {
		for (const disc of discs) disc.image = renderDisc(disc.r, ratio, schemes[disc.scheme]);
	}

	function step(dt: number) {
		for (const disc of discs) {
			disc.angle += disc.spin * dt;
			disc.spin *= Math.exp(-0.5 * dt);
			const target = disc === held ? 1.06 : 1;
			disc.grow += (-260 * (disc.scale - target) - 11 * disc.grow) * dt;
			disc.scale += disc.grow * dt;
		}
		moveBodies(discs, dt, { width, height, held, friction: 1.2 });
	}

	function draw() {
		const context = canvas.getContext('2d');
		if (!context) return;
		context.setTransform(ratio, 0, 0, ratio, 0, 0);
		context.clearRect(0, 0, width, height);
		for (const disc of discs) {
			if (!disc.image) continue;
			const half = disc.r * (1 + GLOW);
			context.save();
			context.translate(disc.x, disc.y);
			context.rotate(disc.angle);
			context.scale(disc.mirror !== flip ? -disc.scale : disc.scale, disc.scale);
			context.drawImage(disc.image, -half, -half, half * 2, half * 2);
			context.restore();
		}
	}

	$effect(() => {
		const observer = new ResizeObserver(() => {
			const w = canvas.clientWidth;
			const h = canvas.clientHeight;
			if (w === 0 || h === 0) return;
			const before = { width, height };
			width = w;
			height = h;
			ratio = Math.min(devicePixelRatio, 2);
			canvas.width = Math.round(w * ratio);
			canvas.height = Math.round(h * ratio);
			if (discs.length === 0) scatter();
			else {
				// Keep the discs in the same places and sizes, as parts of the canvas.
				const size = Math.min(w, h) / Math.min(before.width, before.height);
				for (const disc of discs) {
					disc.x *= w / before.width;
					disc.y *= h / before.height;
					disc.r *= size;
				}
				render();
			}
			draw();
		});
		observer.observe(canvas);

		const stop = animate((dt) => {
			step(dt);
			draw();
		});
		return () => {
			stop();
			observer.disconnect();
		};
	});

	function local(event: PointerEvent) {
		const box = canvas.getBoundingClientRect();
		return { x: event.clientX - box.left, y: event.clientY - box.top };
	}

	function down(event: PointerEvent) {
		const point = local(event);
		const hit = bodyAt(discs, point.x, point.y);
		if (!hit) return;
		held = hit;
		// Draw the held disc on top.
		discs = [...discs.filter((d) => d !== hit), hit];
		grip = { x: point.x - hit.x, y: point.y - hit.y };
		press = point;
		hit.vx = hit.vy = 0;
		motion.start(point.x, point.y);
		canvas.setPointerCapture(event.pointerId);
	}

	function move(event: PointerEvent) {
		if (!held) return;
		const point = local(event);
		held.x = point.x - grip.x;
		held.y = point.y - grip.y;
		motion.move(point.x, point.y);
	}

	function up(event: PointerEvent) {
		if (!held) return;
		const point = local(event);
		if (Math.hypot(point.x - press.x, point.y - press.y) < 5) {
			// A tap spins the disc. A tap on the right side spins it clockwise.
			held.spin += Math.sign(grip.x || 1) * 6;
		} else {
			const { vx, vy } = motion.end();
			held.vx = vx;
			held.vy = vy;
			// A throw from the edge of a disc also spins it, as with a real object.
			held.spin += ((grip.x * vy - grip.y * vx) / (held.r * held.r)) * 0.8;
		}
		held.spin = Math.max(-16, Math.min(16, held.spin));
		held = undefined;
	}

	function spinAll() {
		for (const disc of discs) disc.spin += (Math.random() < 0.5 ? -1 : 1) * (5 + Math.random() * 5);
	}
</script>

<div class="flex flex-1 flex-col">
	<div class="flex flex-wrap items-center gap-x-6 gap-y-3 px-4 py-3 text-sm">
		<button type="button" class="btn" onclick={spinAll}>SPIN</button>
		<button type="button" class="btn" aria-pressed={flip} onclick={() => (flip = !flip)}
			>FLIP</button
		>
		<button type="button" class="btn" onclick={scatter}>RESET</button>
		<span class="opacity-70">Throw or tap a disc to spin it. When it stops, it still turns.</span>
	</div>

	<div class="relative min-h-80 flex-1">
		<canvas
			bind:this={canvas}
			class="absolute inset-0 h-full w-full touch-none"
			aria-label="Discs of colour that seem to turn"
			data-discs={count}
			onpointerdown={down}
			onpointermove={move}
			onpointerup={up}
			onpointercancel={() => (held = undefined)}
		></canvas>
	</div>
</div>
