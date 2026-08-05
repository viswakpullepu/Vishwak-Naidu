const { test, expect } = require('@playwright/test');

test.describe('Smoke Test', () => {
  test('should load the site and complete preloader animation', async ({ page }) => {
    // Navigate to the root URL
    await page.goto('/');

    // Verify the preloader element is present in the DOM
    const preloader = page.locator('#preloader');
    await expect(preloader).toBeAttached();

    // Verify the main content element is present in the DOM
    const mainContent = page.locator('main');
    await expect(mainContent).toBeAttached();

    // Wait for the preloader to receive the 'loaded' class
    // Playwright auto-retries expect assertions, so this will poll until class is added
    await expect(preloader).toHaveClass(/loaded/, { timeout: 10000 });

    // Verify the main page content is visible and no longer has 'hidden' class
    await expect(mainContent).not.toHaveClass(/hidden/, { timeout: 10000 });
    await expect(mainContent).toBeVisible();
  });
});
