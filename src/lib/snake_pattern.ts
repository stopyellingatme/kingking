// The rotating snakes illusion, after Akiyoshi Kitaoka. The picture does not move, but the
// eye sees the discs turn. The motion goes from each dark edge into the dark fill, and from
// each light edge into the light fill.

export interface Scheme {
	name: string;
	// The dark edge, the dark fill, the light edge, and the light fill.
	colours: [string, string, string, string];
}

export const schemes: Scheme[] = [
	{ name: 'CLASSIC', colours: ['#000000', '#1d4ed8', '#ffffff', '#facc15'] },
	{ name: 'CANDY', colours: ['#000000', '#c026d3', '#ffffff', '#5eead4'] },
	{ name: 'SUNSET', colours: ['#1e1b4b', '#e11d48', '#fff7ed', '#fdba74'] },
	{ name: 'MINT', colours: ['#022c22', '#15803d', '#ffffff', '#bef264'] },
	{ name: 'MONO', colours: ['#000000', '#555555', '#ffffff', '#b3b3b3'] }
];

const SEGMENTS = 20;
// The radius of each ring, as a part of the radius of the ring outside it.
const SHRINK = 0.78;
// The four parts of one segment, as parts of the segment angle. The edges are thin.
const PARTS = [0.12, 0.38, 0.12, 0.38];

// Draws one disc on its own canvas, so the pattern can copy it many times.
function disc(diameter: number, colours: Scheme['colours']): HTMLCanvasElement {
	const canvas = document.createElement('canvas');
	canvas.width = canvas.height = Math.max(1, Math.ceil(diameter));
	const context = canvas.getContext('2d')!;
	const centre = diameter / 2;
	const step = (Math.PI * 2) / SEGMENTS;

	// One path for each colour is faster than one path for each part.
	const paths = colours.map(() => new Path2D());
	let outer = diameter / 2;
	for (let ring = 0; outer > diameter * 0.06; ring++) {
		const inner = outer * SHRINK;
		// Each ring starts half a segment after the ring outside it, so the rings look like scales.
		let angle = (ring % 2) * (step / 2);
		for (let segment = 0; segment < SEGMENTS; segment++) {
			PARTS.forEach((part, i) => {
				const end = angle + part * step;
				const path = paths[i];
				path.moveTo(centre + outer * Math.cos(angle), centre + outer * Math.sin(angle));
				path.arc(centre, centre, outer, angle, end);
				path.arc(centre, centre, inner, end, angle, true);
				path.closePath();
				angle = end;
			});
		}
		outer = inner;
	}

	paths.forEach((path, i) => {
		context.fillStyle = colours[i];
		context.fill(path);
	});
	context.fillStyle = colours[1];
	context.beginPath();
	context.arc(centre, centre, outer, 0, Math.PI * 2);
	context.fill();
	return canvas;
}

export interface Pattern {
	width: number;
	height: number;
	// The pixels for each CSS pixel.
	ratio: number;
	// The distance between the centres of two large discs.
	cell: number;
	colours: Scheme['colours'];
	// Turns all the discs the other way.
	flip: boolean;
}

// Fills the canvas with large discs on a grid, and small discs in the gaps between them.
// Next to each other, discs turn in opposite directions.
export function drawSnakes(canvas: HTMLCanvasElement, pattern: Pattern) {
	const { width, height, ratio, cell, colours, flip } = pattern;
	const w = Math.round(width * ratio);
	const h = Math.round(height * ratio);
	if (canvas.width !== w) canvas.width = w;
	if (canvas.height !== h) canvas.height = h;
	const context = canvas.getContext('2d');
	if (!context || cell <= 0) return;

	context.setTransform(ratio, 0, 0, ratio, 0, 0);
	context.fillStyle = colours[1];
	context.fillRect(0, 0, width, height);

	const large = { image: disc(cell * ratio, colours), size: cell };
	const small = { image: disc(cell * 0.42 * ratio, colours), size: cell * 0.42 };
	const put = (x: number, y: number, item: typeof large, mirror: boolean) => {
		context.save();
		context.translate(x, y);
		if (mirror) context.scale(-1, 1);
		context.drawImage(item.image, -item.size / 2, -item.size / 2, item.size, item.size);
		context.restore();
	};

	// A large disc is at the centre of the canvas.
	const across = Math.ceil(width / cell / 2) + 1;
	const down = Math.ceil(height / cell / 2) + 1;
	for (let i = -across; i <= across; i++) {
		for (let j = -down; j <= down; j++) {
			const odd = (i + j) % 2 !== 0;
			put(width / 2 + i * cell, height / 2 + j * cell, large, odd !== flip);
			put(width / 2 + (i + 0.5) * cell, height / 2 + (j + 0.5) * cell, small, odd === flip);
		}
	}
}
