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

test('the snakes page draws discs, and a tap spins one', async ({ page }) => {
	await page.goto('/fun/snakes');
	const canvas = page.locator('canvas');
	await expect(canvas).not.toHaveAttribute('data-discs', '0');
	const opaque = () =>
		canvas.evaluate((element: HTMLCanvasElement) => {
			const { data } = element.getContext('2d')!.getImageData(0, 0, element.width, element.height);
			let count = 0;
			for (let i = 3; i < data.length; i += 4 * 97) if (data[i] > 200) count++;
			return count;
		});
	await expect.poll(opaque).toBeGreaterThan(1000);
	await page.getByRole('button', { name: 'FLIP' }).click();
	await expect(page.getByRole('button', { name: 'FLIP' })).toHaveAttribute('aria-pressed', 'true');
});

test('the afterimage page shows outlines after the stare time', async ({ page }) => {
	await page.clock.install();
	await page.goto('/fun/afterimage');
	const scene = page.getByRole('img', { name: /Soft orbs of colour/ });
	await expect(scene).toHaveAttribute('data-view', 'stare');
	await expect(scene.locator('circle[fill^="url(#orb-"]')).toHaveCount(5);
	await page.getByRole('button', { name: 'START' }).click();
	await page.clock.runFor(21_000);
	await expect(scene).toHaveAttribute('data-view', 'outline');
	await expect(scene.locator('circle[fill="none"][stroke="currentColor"]')).toHaveCount(5);
	await page.getByRole('button', { name: 'TRUE COLOURS' }).click();
	await expect(scene).toHaveAttribute('data-view', 'colour');
});

test('the chaser hides one dot in each ring at a time', async ({ page }) => {
	await page.goto('/fun/chaser');
	const rings = page.getByRole('img', { name: /Rings of dots/ });
	const first = await rings.getAttribute('data-hidden');
	await expect(rings).not.toHaveAttribute('data-hidden', first!);
	await expect(rings.locator('g.ring')).toHaveCount(3);
	await page.getByRole('slider', { name: 'RINGS' }).fill('1');
	await expect(rings.locator('g.ring')).toHaveCount(1);
});

test('SWAP moves the confetti balls to the other side', async ({ page }) => {
	await page.goto('/fun/confetti');
	const canvas = page.locator('canvas');
	// The page makes the balls after it knows the size of the canvas.
	await expect(canvas).not.toHaveAttribute('data-balls', '0');
	const total = Number(await canvas.getAttribute('data-balls'));
	const left = Number(await canvas.getAttribute('data-left'));
	expect(total).toBeGreaterThan(0);
	await page.getByRole('button', { name: 'SWAP' }).click();
	await expect
		.poll(async () => Number(await canvas.getAttribute('data-left')), { timeout: 8000 })
		.toBeCloseTo(total - left, -0.5);
});

test('unknown URLs show the 404 page', async ({ page }) => {
	const response = await page.goto('/nope');
	expect(response?.status()).toBe(404);
	await expect(page.locator('h1')).toHaveText('404');
});
