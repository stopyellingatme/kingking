// The colours of the original gradient bars.
export const palette = [
	'#f20019',
	'#33137a',
	'#161415',
	'#222423',
	'#0333b4',
	'#015ad5',
	'#00a6f1',
	'#97d7e9',
	'#f9f5f2',
	'#f9f5f2',
	'#fbbd00',
	'#f76d02',
	'#f20019',
	'#770e7d',
	'#222423',
	'#161415',
	'#1c2121',
	'#0333b4',
	'#015ad5',
	'#00a6f1'
];

// A gradient of the palette. The last colour repeats the first, so the strip can repeat without a seam.
export const strip = `linear-gradient(to right, ${[...palette, palette[0]].join(', ')})`;
