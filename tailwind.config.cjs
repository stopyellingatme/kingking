const conicGradient = (theme, direction, colorList) => {
	const params = [direction, ...colorList.map((color) => theme(`colors.${color}`))];

	return `conic-gradient(${params.join(', ')})`;
};

const colors = require('tailwindcss/colors');

module.exports = {
  darkMode: 'class',
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			colors: {
				amber: colors.amber,
				lightBlue: colors.lightBlue,
				rose: colors.rose,
				gray: colors.gray
			},
			backgroundImage: (theme) => ({
				'conic-gradient': conicGradient(theme, 'from 300deg', [
					'red.400',
					'amber.100',
					'lightBlue.500',
					'blue.300',
					'purple.600',
					'pink.500',
					'rose.600',
					'red.400'
				])
			}),
			animation: {
				blob: 'blob 7s infinite'
			},
			keyframes: {
				blob: {
					'0%, 100%': {
						transform: 'translate(0, 0) scale(1)'
					},
					'25%': {
						transform: 'translate(20px, -50px) scale(1.1)'
					},
					'50%': {
						transform: 'translate(0, 20px) scale(1)'
					},
					'75%': {
						transform: 'translate(-20px, -15px) scale(0.9)'
					}
				}
			}
		}
	},
  variants: {
    extend: {},
  },
	plugins: []
};
