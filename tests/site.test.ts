import { expect, test } from '@playwright/test';

const pages = [
	{ path: '/', title: 'TK' },
	{ path: '/about', title: 'Me · TK' },
	{ path: '/fun', title: 'Space · TK' },
	{ path: '/fun/gradients', title: 'Gradients · TK' },
	{ path: '/fun/circular', title: 'Circular · TK' },
	{ path: '/fun/m1', title: 'M1 · TK' },
	{ path: '/fun/zeal', title: 'Zeal · TK' },
	{ path: '/fun/snakes', title: 'Snakes · TK' },
	{ path: '/fun/afterimage', title: 'Afterimage · TK' },
	{ path: '/fun/chaser', title: 'Chaser · TK' },
	{ path: '/fun/confetti', title: 'Confetti · TK' }
];

for (const { path, title } of pages) {
	test(`${path} loads with a title and a description`, async ({ page }) => {
		const errors: string[] = [];
		page.on('pageerror', (error) => errors.push(error.message));

		const response = await page.goto(path);
		expect(response?.status()).toBe(200);
		await expect(page).toHaveTitle(title);
		await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', /\S/);
		expect(errors).toEqual([]);
	});
}

test('about page has expected h1', async ({ page }) => {
	await page.goto('/about');
	await expect(page.locator('h1')).toHaveText('T.KING');
});

test('the theme toggle switches dark mode and remembers it', async ({ page }) => {
	await page.emulateMedia({ colorScheme: 'light' });
	await page.goto('/');
	const html = page.locator('html');
	await expect(html).not.toHaveClass(/dark/);

	await page.getByRole('button', { name: 'Toggle dark mode' }).click();
	await expect(html).toHaveClass(/dark/);

	await page.reload();
	await expect(html).toHaveClass(/dark/);
});

test('pages do not scroll when the content fits', async ({ page }) => {
	await page.goto('/about');
	const overflow = await page.evaluate(
		() => document.documentElement.scrollHeight - window.innerHeight
	);
	expect(overflow).toBeLessThanOrEqual(0);
});

test('the rings slider changes the number of rings, and a ring set can be dragged', async ({
	page
}) => {
	await page.goto('/fun/circular');
	const rings = page.locator('g.rings circle:not([role="button"])');
	await expect(rings).toHaveCount(3 * 75);
	await page.getByRole('slider', { name: 'RINGS' }).fill('10');
	await expect(rings).toHaveCount(3 * 10);

	const handle = page.getByRole('button', { name: /Move the yellow rings/ });
	const group = page.locator('g.rings').first();
	const before = await group.getAttribute('transform');
	const box = (await handle.boundingBox())!;
	await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
	await page.mouse.down();
	await page.mouse.move(box.x + 150, box.y + 80, { steps: 5 });
	await page.mouse.up();
	await expect(group).not.toHaveAttribute('transform', before!);
});

test('the gradient editor adds colours and changes the gradient type', async ({ page }) => {
	await page.goto('/fun/gradients');
	const swatches = page.getByRole('list', { name: 'Colours' }).getByLabel(/^Colour \d+$/);
	const count = await swatches.count();
	await page.getByRole('button', { name: '+ ADD' }).click();
	await expect(swatches).toHaveCount(count + 1);

	await page.getByRole('button', { name: 'CONIC' }).click();
	await expect(page.locator('code')).toContainText('conic-gradient');
});

test('a tap on the zeal page adds a blob', async ({ page }) => {
	await page.goto('/fun/zeal');
	const canvas = page.locator('canvas');
	await expect(canvas).toHaveAttribute('data-blobs', '11');
	await canvas.click({ position: { x: 100, y: 100 } });
	await expect(canvas).toHaveAttribute('data-blobs', '12');
});

test('the snakes page draws the discs and changes the colours', async ({ page }) => {
	await page.goto('/fun/snakes');
	const canvas = page.locator('canvas');
	await page.getByRole('button', { name: 'CANDY' }).click();
	await expect(canvas).toHaveAttribute('data-scheme', 'CANDY');
	await expect
		.poll(() =>
			canvas.evaluate((element: HTMLCanvasElement) => {
				const context = element.getContext('2d')!;
				const { data } = context.getImageData(0, 0, element.width, element.height);
				let opaque = 0;
				for (let i = 3; i < data.length; i += 4 * 97) if (data[i] > 0) opaque++;
				return opaque;
			})
		)
		.toBeGreaterThan(1000);
});

test('the afterimage page goes grey after the stare time', async ({ page }) => {
	await page.clock.install();
	await page.goto('/fun/afterimage');
	const scene = page.getByRole('img', { name: 'A sunset over the sea' });
	await expect(scene).toHaveAttribute('data-view', 'stare');
	await page.getByRole('button', { name: 'START' }).click();
	await page.clock.runFor(21_000);
	await expect(scene).toHaveAttribute('data-view', 'grey');
	await page.getByRole('button', { name: 'TRUE COLOURS' }).click();
	await expect(scene).toHaveAttribute('data-view', 'colour');
});

test('the chaser hides one dot at a time', async ({ page }) => {
	await page.goto('/fun/chaser');
	const ring = page.getByRole('img', { name: /A ring of dots/ });
	const first = await ring.getAttribute('data-hidden');
	await expect(ring).not.toHaveAttribute('data-hidden', first!);
	await expect(ring.locator('circle[visibility="hidden"]')).toHaveCount(1);
});

test('a confetti ball takes the colour of the side it is on', async ({ page }) => {
	await page.goto('/fun/confetti');
	await page.getByRole('button', { name: 'CYCLE' }).click();
	const ball = page.locator('g.ball[data-side="a"]').first();
	const index = await ball.evaluate((element) =>
		[...element.parentNode!.children].indexOf(element)
	);
	const area = (await page.getByRole('img', { name: /Balls of one colour/ }).boundingBox())!;
	const box = (await ball.boundingBox())!;
	await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
	await page.mouse.down();
	await page.mouse.move(area.x + area.width * 0.8, area.y + area.height / 2, { steps: 8 });
	await page.mouse.up();
	const moved = page.locator('svg[aria-label^="Balls"] > *').nth(index);
	await expect(moved).toHaveAttribute('data-side', 'b');
});

test('unknown URLs show the 404 page', async ({ page }) => {
	const response = await page.goto('/nope');
	expect(response?.status()).toBe(404);
	await expect(page.locator('h1')).toHaveText('404');
});
