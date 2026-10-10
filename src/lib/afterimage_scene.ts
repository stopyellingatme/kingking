import { grey, hslToRgb, toHex } from '$lib/colour';

// A sunset over the sea, made of flat shapes. The view box is 400 by 300, and the
// shapes go past its edges, so the picture can fill a screen of any shape.

export interface Shape {
	kind: 'rect' | 'circle' | 'polygon';
	// The attributes of the SVG element, without the fill.
	attributes: Record<string, string | number>;
	hue: number;
	saturation: number;
	lightness: number;
}

const sky = (y: number, height: number, hue: number, lightness: number): Shape => ({
	kind: 'rect',
	// Each band goes 2 units into the next band, so no thin line shows between them.
	attributes: { x: -400, y, width: 1200, height: height + 2 },
	hue,
	saturation: 0.85,
	lightness
});

export const shapes: Shape[] = [
	sky(-300, 360, 250, 0.45),
	sky(60, 50, 290, 0.5),
	sky(110, 40, 330, 0.55),
	sky(150, 50, 20, 0.55),
	{
		kind: 'circle',
		attributes: { cx: 200, cy: 175, r: 62 },
		hue: 50,
		saturation: 0.95,
		lightness: 0.55
	},
	{
		kind: 'polygon',
		attributes: { points: '-400,200 -400,175 -30,160 60,110 160,200' },
		hue: 150,
		saturation: 0.7,
		lightness: 0.35
	},
	{
		kind: 'polygon',
		attributes: { points: '240,200 330,95 420,150 800,165 800,200' },
		hue: 170,
		saturation: 0.75,
		lightness: 0.4
	},
	{
		kind: 'rect',
		attributes: { x: -400, y: 200, width: 1200, height: 400 },
		hue: 205,
		saturation: 0.85,
		lightness: 0.45
	},
	...[0, 1, 2, 3, 4].map((i): Shape => ({
		kind: 'rect',
		attributes: {
			x: 200 - (55 - i * 9),
			y: 210 + i * 16,
			width: (55 - i * 9) * 2,
			height: 7,
			rx: 3.5
		},
		hue: 50,
		saturation: 0.95,
		lightness: 0.6
	}))
];

export type View = 'colour' | 'stare' | 'grey';

// The fill of a shape in each view. The stare view has the opposite hue at the same lightness.
// The grey view has the brightness of the true colour, and no colour.
export function fillOf(shape: Shape, view: View, turn: number): string {
	const hue = shape.hue + turn + (view === 'stare' ? 180 : 0);
	const rgb = hslToRgb(((hue % 360) + 360) % 360, shape.saturation, shape.lightness);
	return view === 'grey' ? grey(rgb) : toHex(rgb);
}
