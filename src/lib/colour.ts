// Small colour helpers for the illusions.

export type Rgb = [number, number, number];

// Hue in degrees, saturation and lightness from 0 to 1. Returns channels from 0 to 255.
export function hslToRgb(h: number, s: number, l: number): Rgb {
	const k = (n: number) => (n + h / 30) % 12;
	const a = s * Math.min(l, 1 - l);
	const f = (n: number) => l - a * Math.max(-1, Math.min(k(n) - 3, 9 - k(n), 1));
	return [f(0) * 255, f(8) * 255, f(4) * 255];
}

export function toHex([r, g, b]: Rgb): string {
	return `#${[r, g, b]
		.map((c) =>
			Math.round(Math.max(0, Math.min(255, c)))
				.toString(16)
				.padStart(2, '0')
		)
		.join('')}`;
}

export function fromHex(hex: string): Rgb {
	const n = parseInt(hex.slice(1), 16);
	return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

// The grey that has the same brightness as the colour, to the eye.
export function grey([r, g, b]: Rgb): string {
	const linear = (c: number) => {
		const v = c / 255;
		return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
	};
	const y = 0.2126 * linear(r) + 0.7152 * linear(g) + 0.0722 * linear(b);
	const v = y <= 0.0031308 ? y * 12.92 : 1.055 * y ** (1 / 2.4) - 0.055;
	return toHex([v * 255, v * 255, v * 255]);
}

// Turns the hue of a colour by a number of degrees, and keeps its saturation and lightness.
export function turnHue(hex: string, degrees: number): string {
	const [r, g, b] = fromHex(hex).map((c) => c / 255);
	const max = Math.max(r, g, b);
	const min = Math.min(r, g, b);
	const l = (max + min) / 2;
	const d = max - min;
	if (d === 0) return hex;
	const s = d / (1 - Math.abs(2 * l - 1));
	let h = max === r ? ((g - b) / d) % 6 : max === g ? (b - r) / d + 2 : (r - g) / d + 4;
	h = h * 60 + degrees;
	return toHex(hslToRgb(((h % 360) + 360) % 360, s, l));
}
