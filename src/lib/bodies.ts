// Round bodies that move, slow down, bounce at the walls, and push each other apart.
// The SNAKES, AFTERIMAGE, and CONFETTI pages use them for drag and throw.

export interface Body {
	x: number;
	y: number;
	vx: number;
	vy: number;
	r: number;
}

export interface World {
	width: number;
	height: number;
	// How fast the bodies slow down. A larger value stops them sooner.
	friction?: number;
	// The part of the speed that a body keeps after it hits a wall.
	bounce?: number;
	// The body that the pointer holds. It does not move with the physics.
	held?: Body;
	onWall?: (body: Body, axis: 'x' | 'y', speed: number) => void;
}

export function moveBodies(bodies: Body[], dt: number, world: World) {
	const { width, height, friction = 1.4, bounce = 0.7, held, onWall } = world;
	const drag = Math.exp(-friction * dt);

	for (const body of bodies) {
		if (body === held) continue;
		body.vx *= drag;
		body.vy *= drag;
		body.x += body.vx * dt;
		body.y += body.vy * dt;
	}

	// Bodies that overlap move apart a little on each frame, so the push is soft.
	// If they move toward each other, they bounce. A large body is heavier than a small one.
	for (let i = 0; i < bodies.length; i++) {
		for (let j = i + 1; j < bodies.length; j++) {
			const a = bodies[i];
			const b = bodies[j];
			const dx = b.x - a.x;
			const dy = b.y - a.y;
			const d = Math.hypot(dx, dy) || 1;
			const overlap = a.r + b.r - d;
			if (overlap <= 0) continue;
			const nx = dx / d;
			const ny = dy / d;
			const ma = a === held ? Infinity : a.r * a.r;
			const mb = b === held ? Infinity : b.r * b.r;
			const shareA = ma === Infinity ? 0 : mb === Infinity ? 1 : mb / (ma + mb);
			const shift = Math.min(overlap, overlap * 12 * dt);
			a.x -= nx * shift * shareA;
			a.y -= ny * shift * shareA;
			b.x += nx * shift * (1 - shareA);
			b.y += ny * shift * (1 - shareA);

			const closing = (b.vx - a.vx) * nx + (b.vy - a.vy) * ny;
			if (closing >= 0) continue;
			const impulse = -1.6 * closing;
			a.vx -= nx * impulse * shareA;
			a.vy -= ny * impulse * shareA;
			b.vx += nx * impulse * (1 - shareA);
			b.vy += ny * impulse * (1 - shareA);
		}
	}

	for (const body of bodies) {
		if (body === held) continue;
		if (body.x < body.r || body.x > width - body.r) {
			body.x = Math.min(Math.max(body.x, body.r), Math.max(body.r, width - body.r));
			onWall?.(body, 'x', body.vx);
			body.vx *= -bounce;
		}
		if (body.y < body.r || body.y > height - body.r) {
			body.y = Math.min(Math.max(body.y, body.r), Math.max(body.r, height - body.r));
			onWall?.(body, 'y', body.vy);
			body.vy *= -bounce;
		}
	}
}

// Finds the top body at a point. The top body is the last one drawn.
export function bodyAt<T extends Body>(bodies: T[], x: number, y: number): T | undefined {
	return bodies.findLast((body) => Math.hypot(body.x - x, body.y - y) <= body.r);
}

// Measures the speed of the pointer, so a body keeps that speed when you let go.
export function tracker() {
	let x = 0;
	let y = 0;
	let time = 0;
	let vx = 0;
	let vy = 0;

	return {
		start(px: number, py: number) {
			x = px;
			y = py;
			time = performance.now();
			vx = vy = 0;
		},
		move(px: number, py: number) {
			const now = performance.now();
			const dt = Math.max((now - time) / 1000, 1 / 240);
			// Smooth the speed, because pointer events do not come at a steady rate.
			vx = vx * 0.4 + ((px - x) / dt) * 0.6;
			vy = vy * 0.4 + ((py - y) / dt) * 0.6;
			x = px;
			y = py;
			time = now;
		},
		// If the pointer stopped before you let go, the body does not move.
		end(): { vx: number; vy: number } {
			if (performance.now() - time > 80) return { vx: 0, vy: 0 };
			const speed = Math.hypot(vx, vy);
			const limit = Math.min(1, 3000 / (speed || 1));
			return { vx: vx * limit, vy: vy * limit };
		}
	};
}
