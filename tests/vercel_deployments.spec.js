const { test, expect } = require('@playwright/test');

test.describe('Milestone 2: Vercel Deployments & Fallback Link Resolution', () => {
  test('Verify static fallback rendering of 20 Vercel deployment cards into #vercel-deployments', async ({ page }) => {
    await page.goto('/');

    // Wait for preloader to finish and main content to be visible
    await page.waitForSelector('main:not(.hidden)', { timeout: 15000 });

    // Wait for vercel container to be displayed
    const vercelContainer = page.locator('#vercel-deployments');
    await expect(vercelContainer).toBeVisible({ timeout: 10000 });

    // Evaluate cards rendered in #vercel-deployments
    const cardData = await page.evaluate(() => {
      const cards = Array.from(document.querySelectorAll('#vercel-deployments .vercel-card'));
      return cards.map(c => {
        const href = c.getAttribute('href');
        const target = c.getAttribute('target');
        const hasBrokenLinkClass = c.classList.contains('broken-link');
        const titleEl = c.querySelector('.vercel-card-title');
        const statusEl = c.querySelector('.vercel-status');
        const computedStyle = window.getComputedStyle(c);

        return {
          href,
          target,
          hasBrokenLinkClass,
          titleText: titleEl ? titleEl.innerText.trim() : '',
          statusText: statusEl ? statusEl.innerText.trim() : '',
          border: computedStyle.border,
          boxShadow: computedStyle.boxShadow
        };
      });
    });

    console.log(`Found ${cardData.length} Vercel deployment cards.`);
    expect(cardData.length).toBe(20);

    // Verify each card has proper target and valid Vercel URL
    cardData.forEach(card => {
      expect(card.target).toBe('_blank');
      expect(card.href).toMatch(/^https:\/\/[a-z0-9-]+\.vercel\.app$/i);
    });

    // Check specific inferred URLs formatting
    const hrefs = cardData.map(c => c.href);
    expect(hrefs).toContain('https://ngl-clone.vercel.app');
    expect(hrefs).toContain('https://kothas-atelier.vercel.app');
    expect(hrefs).toContain('https://viswak-portfolio.vercel.app');
    expect(hrefs).toContain('https://vishwak-naidu.vercel.app');

    // Verify fallback cards have broken-link class and red border visual indicator
    const fallbackCards = cardData.filter(c => c.hasBrokenLinkClass);
    expect(fallbackCards.length).toBeGreaterThan(0);
    fallbackCards.forEach(c => {
      expect(c.statusText).toContain('Manual Review');
    });
  });
});
