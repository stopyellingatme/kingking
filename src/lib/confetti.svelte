<script lang="ts">
	import { bodyAt, moveBodies, tracker, type Body } from '$lib/bodies';
	import { animate, approach, reducedMotion } from '$lib/motion';

	// The confetti illusion, after David Novick. All the balls have one colour. On the left,
	// warm stripes cross the balls. On the right, cool stripes cross them. The eye mixes each
	// ball with its stripes, so the two sides look different.

	// The stripe colours from the site palette. The last colour repeats the first, so the flow has no seam.
	const warm = ['#f20019', '#f76d02', '#f20019', '#770e7d', '#f20019'];
	const cool = ['#0333b4', '#015ad5', '#33137a', '#0333b4'];
	const balls = [
		{ name: 'GOLD', colour: '#fbbd00' },
		{ name: 'CREAM', colour: '#f9f5f2' },
		{ name: 'ICE', colour: '#97d7e9' }
	];
	const MAX = 30;

	interface Ball extends Body {
		// The scale on each axis, and its speed. A spring pulls the scale back to 1, so the ball wobbles.
		sx: number;
		sy: number;
		vsx: number;
		vsy: number;
		phase: number;
	}

	let canvas: HTMLCanvasElement;
	// The balls change on each frame. They are not Svelte state, so only the canvas updates.
	let items: Ball[] = [];
	let count = $state(0);
	let onLeft = $state(0);
	let colour = $state(balls[0].colour);
	let stripe = $state(2);
	let flow = $state(true);
	let reveal = $state(false);
	let width = 0;
	let height = 0;
	let ratio = 1;
	let held: Ball | undefined;
	let grip = { x: 0, y: 0 };
	let press: { x: number; y: number } | undefined;
	const motion = tracker();

	function make(x: number, y: number, pop = false): Ball {
		const scale = Math.max(0.6, Math.min(1.3, Math.min(width, height) / 600));
		return {
			x,
			y,
			r: (22 + Math.random() * 24) * scale,
			vx: (Math.random() - 0.5) * 80,
			vy: (Math.random() - 0.5) * 80,
			sx: pop ? 0.2 : 1,
			sy: pop ? 0.2 : 1,
			vsx: 0,
			vsy: 0,
			phase: Math.random() * Math.PI * 2
		};
	}

	function scatter() {
		const total = Math.max(8, Math.min(24, Math.round((width * height) / 30000)));
		// Put half of the balls on each side.
		items = Array.from({ length: total }, (_, i) => {
			const left = i % 2 === 0;
			const x = (left ? 0.05 : 0.55) * width + Math.random() * width * 0.4;
			return make(x, height * (0.1 + Math.random() * 0.8));
		});
		count = items.length;
	}

	// Squash the ball along one axis and stretch it along the other.
	function squash(body: Body, axis: 'x' | 'y', speed: number) {
		const ball = body as Ball;
		const kick = Math.min(Math.abs(speed) * 0.005, 3);
		if (axis === 'x') {
			ball.vsx -= kick;
			ball.vsy += kick;
		} else {
			ball.vsy -= kick;
			ball.vsx += kick;
		}
	}

	function step(dt: number, time: number, calm: boolean) {
		for (const ball of items) {
			if (!calm && ball !== held) {
				// A slow push in a direction that changes over time, so the balls float.
				ball.vx += Math.cos(time * 0.4 + ball.phase) * 25 * dt;
				ball.vy += Math.sin(time * 0.3 + ball.phase * 1.7) * 25 * dt;
			}
			ball.vsx += (-160 * (ball.sx - 1) - 7 * ball.vsx) * dt;
			ball.vsy += (-160 * (ball.sy - 1) - 7 * ball.vsy) * dt;
			ball.sx = Math.max(0.4, ball.sx + ball.vsx * dt);
			ball.sy = Math.max(0.4, ball.sy + ball.vsy * dt);
		}
		moveBodies(items, dt, { width, height, held, friction: 0.6, bounce: 0.8, onWall: squash });
	}

	// A gradient twice as wide as the canvas. It moves to the left, then starts again, with no seam.
	function band(context: CanvasRenderingContext2D, stops: string[], shift: number) {
		const gradient = context.createLinearGradient(-shift, 0, width * 2 - shift, 0);
		for (let copy = 0; copy < 2; copy++) {
			stops.forEach((stop, i) => {
				gradient.addColorStop((copy + i / (stops.length - 1)) / 2, stop);
			});
		}
		return gradient;
	}

	function rows(context: CanvasRenderingContext2D, top: number, bottom: number, offset: number) {
		const period = stripe * 2;
		for (let y = Math.floor(top / period) * period + offset; y < bottom; y += period) {
			context.fillRect(0, y, width, stripe);
		}
	}

	let overlay = 1;

	function draw(time: number) {
		const context = canvas.getContext('2d');
		// The first frames can come before the size is known.
		if (!context || width === 0) return;
		context.setTransform(ratio, 0, 0, ratio, 0, 0);
		const shift = flow ? (time * 30) % width : 0;
		const a = band(context, warm, shift);
		const b = band(context, cool, width - shift);

		context.fillStyle = b;
		context.fillRect(0, 0, width, height);
		context.fillStyle = a;
		rows(context, 0, height, 0);

		let left = 0;
		for (const ball of items) {
			const side = ball.x < width / 2;
			if (side) left++;
			context.beginPath();
			context.ellipse(ball.x, ball.y, ball.r * ball.sx, ball.r * ball.sy, 0, 0, Math.PI * 2);
			context.fillStyle = colour;
			context.fill();
			if (overlay < 0.01) continue;
			// The stripes of one colour cross the ball. The other stripes stop at its edge.
			context.save();
			context.clip();
			context.globalAlpha = overlay;
			context.fillStyle = side ? a : b;
			const reach = ball.r * Math.max(ball.sx, ball.sy);
			rows(context, ball.y - reach, ball.y + reach, side ? 0 : stripe);
			context.restore();
		}
		if (left !== onLeft) onLeft = left;
	}

	$effect(() => {
		const calm = reducedMotion();
		if (calm) flow = false;

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
			if (items.length === 0) scatter();
			else {
				for (const ball of items) {
					ball.x *= w / before.width;
					ball.y *= h / before.height;
				}
			}
			draw(performance.now() / 1000);
		});
		observer.observe(canvas);

		const stop = animate((dt, time) => {
			overlay = approach(overlay, reveal ? 0 : 1, 6, dt);
			step(dt, time, calm);
			draw(time);
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
		press = point;
		const hit = bodyAt(items, point.x, point.y);
		if (!hit) return;
		held = hit;
		items = [...items.filter((ball) => ball !== hit), hit];
		grip = { x: point.x - hit.x, y: point.y - hit.y };
		hit.vx = hit.vy = 0;
		hit.vsx += 1.5;
		hit.vsy += 1.5;
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
		const point = local(event);
		if (held) {
			const { vx, vy } = motion.end();
			held.vx = vx;
			held.vy = vy;
			held = undefined;
		} else if (press && Math.hypot(point.x - press.x, point.y - press.y) < 8) {
			// A tap on the stripes adds a ball.
			const ball = make(point.x, point.y, true);
			ball.vx = ball.vy = 0;
			items = [...items.slice(-(MAX - 1)), ball];
			count = items.length;
		}
		press = undefined;
	}

	// Throw each ball to the same place on the other side. The friction stops it near there.
	function swap() {
		for (const ball of items) ball.vx = (width - 2 * ball.x) * 0.6;
	}
</script>

<div class="flex flex-1 flex-col">
	<div class="flex flex-wrap items-center gap-x-6 gap-y-3 px-4 py-3 text-sm">
		<div class="flex flex-wrap gap-2" role="group" aria-label="Ball colour">
			{#each balls as item (item.name)}
				<button
					type="button"
					class="btn flex items-center gap-2"
					aria-pressed={colour === item.colour}
					onclick={() => (colour = item.colour)}
				>
					<span
						class="h-3 w-3 rounded-full border border-current"
						style="background: {item.colour}"
						aria-hidden="true"
					></span>
					{item.name}
				</button>
			{/each}
		</div>
		<label class="flex items-center gap-2">
			STRIPES
			<input type="range" min="1" max="6" step="1" bind:value={stripe} class="w-20" />
		</label>
		<button type="button" class="btn" aria-pressed={flow} onclick={() => (flow = !flow)}
			>FLOW</button
		>
		<button type="button" class="btn" onclick={swap}>SWAP</button>
		<button type="button" class="btn" aria-pressed={reveal} onclick={() => (reveal = !reveal)}
			>REVEAL</button
		>
		<span class="opacity-70">All the balls are one colour. Throw one across the middle.</span>
	</div>

	<div class="relative min-h-80 flex-1">
		<canvas
			bind:this={canvas}
			class="absolute top-0 left-4 h-[calc(100%-1rem)] w-[calc(100%-2rem)] touch-none rounded-lg"
			aria-label="Balls of one colour behind coloured stripes"
			data-balls={count}
			data-left={onLeft}
			onpointerdown={down}
			onpointermove={move}
			onpointerup={up}
			onpointercancel={() => (held = press = undefined)}
		></canvas>
	</div>
</div>
