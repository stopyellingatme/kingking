import { mix } from '$lib/colour';

// The rotating snakes illusion, after Akiyoshi Kitaoka. A still disc seems to turn. The motion
// goes from each dark edge into the dark fill, and from each light edge into the light fill.
// The colours come from the site palette. The fills change from the outer ring to the inner ring.

export interface Scheme {
	dark: [string, string];
	light: [string, string];
}

const DARK_EDGE = '#161415';
const LIGHT_EDGE = '#f9f5f2';

export const schemes: Scheme[] = [
	{ dark: ['#0333b4', '#33137a'], light: ['#fbbd00', '#f76d02'] },
	{ dark: ['#770e7d', '#0333b4'], light: ['#00a6f1', '#97d7e9'] },
	{ dark: ['#f20019', '#770e7d'], light: ['#97d7e9', '#fbbd00'] },
	{ dark: ['#015ad5', '#f20019'], light: ['#fbbd00', '#97d7e9'] }
];

const SEGMENTS = 20;
// The radius of each ring, as a part of the radius of the ring outside it.
const SHRINK = 0.78;
// The four parts of one segment, as parts of the segment angle. The edges are thin.
const PARTS = [0.12, 0.38, 0.12, 0.38];
// The soft glow around the disc, as a part of the radius.
export const GLOW = 0.3;

// Draws one disc and its glow on its own canvas. The page then turns and moves the canvas
// on each frame, so it does not draw the disc again.
export function renderDisc(radius: number, ratio: number, scheme: Scheme): HTMLCanvasElement {
	const half = radius * (1 + GLOW);
	const canvas = document.createElement('canvas');
	canvas.width = canvas.height = Math.max(1, Math.ceil(half * 2 * ratio));
	const context = canvas.getContext('2d')!;
	context.scale(ratio, ratio);
	const step = (Math.PI * 2) / SEGMENTS;

	// The shadow blur is in canvas pixels, so it uses the ratio.
	context.shadowColor = `${scheme.light[0]}aa`;
	context.shadowBlur = radius * GLOW * ratio;
	context.fillStyle = DARK_EDGE;
	context.beginPath();
	context.arc(half, half, radius, 0, Math.PI * 2);
	context.fill();
	context.shadowColor = 'transparent';

	let rings = 0;
	for (let r = radius; r > radius * 0.1; r *= SHRINK) rings++;

	let outer = radius;
	for (let ring = 0; ring < rings; ring++) {
		const t = ring / Math.max(1, rings - 1);
		const colours = [
			DARK_EDGE,
			mix(scheme.dark[0], scheme.dark[1], t),
			LIGHT_EDGE,
			mix(scheme.light[0], scheme.light[1], t)
		];
		const inner = outer * SHRINK;
		// Each ring starts half a segment after the ring outside it, so the rings look like scales.
		let angle = (ring % 2) * (step / 2);
		const paths = colours.map(() => new Path2D());
		for (let segment = 0; segment < SEGMENTS; segment++) {
			PARTS.forEach((part, i) => {
				const end = angle + part * step;
				paths[i].moveTo(half + outer * Math.cos(angle), half + outer * Math.sin(angle));
				paths[i].arc(half, half, outer, angle, end);
				paths[i].arc(half, half, inner, end, angle, true);
				paths[i].closePath();
				angle = end;
			});
		}
		paths.forEach((path, i) => {
			context.fillStyle = colours[i];
			context.fill(path);
		});
		outer = inner;
	}

	context.fillStyle = scheme.dark[1];
	context.beginPath();
	context.arc(half, half, outer, 0, Math.PI * 2);
	context.fill();
	return canvas;
}
