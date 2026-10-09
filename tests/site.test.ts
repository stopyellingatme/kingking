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

test('the circle count input changes the number of rings', async ({ page }) => {
	await page.goto('/fun/circular');
	const rings = page.locator('.rounded-full');
	await expect(rings).toHaveCount(3 * 75);
	await page.getByLabel('# of Circles').fill('10');
	await expect(rings).toHaveCount(3 * 10);
});

test('unknown URLs show the 404 page', async ({ page }) => {
	const response = await page.goto('/nope');
	expect(response?.status()).toBe(404);
	await expect(page.locator('h1')).toHaveText('404');
});
