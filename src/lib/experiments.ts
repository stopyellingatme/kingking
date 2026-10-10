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
	},
	{
		slug: 'snakes',
		name: 'SNAKES',
		note: 'Discs of colour that seem to turn. The picture does not move. Your eyes make the motion.'
	},
	{
		slug: 'afterimage',
		name: 'AFTERIMAGE',
		note: 'Look at a dot for 20 seconds. Then the picture goes grey, but you still see colour.'
	},
	{
		slug: 'chaser',
		name: 'CHASER',
		note: 'Dots go out one at a time. Look at the cross, and a dot of the opposite colour goes around.'
	},
	{
		slug: 'confetti',
		name: 'CONFETTI',
		note: 'All the balls have one colour, but the stripes make them look different. Drag one across.'
	}
];
