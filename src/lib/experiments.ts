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
		note: 'Six bars that flow at different speeds. Drag a bar to throw it, then make your own gradient.'
	},
	{
		slug: 'circular',
		name: 'CIRCULAR',
		note: 'Three sets of rings that make moiré patterns. Drag and throw them to make new patterns.'
	},
	{
		slug: 'm1',
		name: 'M1 ‹-› TK',
		note: 'A conic gradient turns slowly and glows behind the TK mark. The light follows your pointer.'
	},
	{
		slug: 'zeal',
		name: 'ZEAL',
		note: 'Soft, bouncy blobs of colour. Push them, tap to add more, and turn on gravity.'
	}
];
