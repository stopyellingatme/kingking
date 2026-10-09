export interface Experiment {
	slug: string;
	name: string;
	note: string;
}

// The order here is the order on the home page and in the previous/next links.
export const experiments: Experiment[] = [
	{
		slug: 'gradients',
		name: 'GRADIENTS',
		note: 'Six bars that turn through the hues at different speeds, and an editor to make your own.'
	},
	{
		slug: 'circular',
		name: 'CIRCULAR',
		note: 'Three sets of rings that overlap and fade between cyan, magenta, and yellow.'
	},
	{
		slug: 'm1',
		name: 'M1 ‹-› TK',
		note: 'A conic gradient that glows behind the TK mark.'
	},
	{
		slug: 'zeal',
		name: 'ZEAL',
		note: 'Soft blobs of colour that move slowly.'
	}
];
