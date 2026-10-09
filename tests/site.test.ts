import { expect, test } from '@playwright/test';

const pages = [
	{ path: '/', title: 'TK' },
	{ path: '/about', title: 'Me · TK' },
	{ path: '/fun', title: 'Space · TK' },
	{ path: '/fun/gradients', title: 'Gradients · TK' },
	{ path: '/fun/circular', title: 'Circular · TK' },
	{ path: '/fun/m1', title: 'M1 · TK' },
	{ path: '/fun/zeal', title: 'Zeal · TK' }
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
	const blobs = page.locator('svg ellipse');
	await expect(blobs).toHaveCount(11);
	await page.locator('svg[role="img"]').click({ position: { x: 100, y: 100 } });
	await expect(blobs).toHaveCount(12);
});

test('unknown URLs show the 404 page', async ({ page }) => {
	const response = await page.goto('/nope');
	expect(response?.status()).toBe(404);
	await expect(page.locator('h1')).toHaveText('404');
});
