import { turnHue } from '$lib/colour';

// The true colours of the afterimage orbs, from the site palette: the edge, then the light spot.
export const orbColours: [string, string][] = [
	['#f20019', '#f76d02'],
	['#00a6f1', '#97d7e9'],
	['#fbbd00', '#f9f5f2'],
	['#0333b4', '#00a6f1'],
	['#770e7d', '#f20019']
];

// The stare colours have the opposite hue. After a long look at them, the eye adds the true colours.
export function stareColours([edge, light]: [string, string]): [string, string] {
	return [turnHue(edge, 180), turnHue(light, 180)];
}
