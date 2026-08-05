const { test, expect } = require('@playwright/test');

test.describe('Requirement 5b Re-testing: Email Text Wrapping on 320px viewport', () => {

  test('Verify computed wordBreak & overflowWrap on .detail-value and a[href^="mailto:"] on 320px viewport', async ({ page }) => {
    // Set 320px viewport (Small Mobile breakpoint)
    await page.setViewportSize({ width: 320, height: 568 });
    await page.goto('/');

    // Wait for preloader / main content
    await page.waitForSelector('main:not(.hidden)', { timeout: 10000 });

    const results = await page.evaluate(() => {
      const emailLink = document.querySelector('a[href^="mailto:"]');
      const detailVal = document.querySelector('.detail-value');
      
      const linkStyle = emailLink ? window.getComputedStyle(emailLink) : null;
      const valStyle = detailVal ? window.getComputedStyle(detailVal) : null;

      const docEl = document.documentElement;
      const body = document.body;

      const windowWidth = window.innerWidth;
      const scrollWidth = Math.max(docEl.scrollWidth, body.scrollWidth);
      const clientWidth = docEl.clientWidth;
      const horizontalOverflow = Math.max(0, scrollWidth - clientWidth);

      // Bounding box of email link and detail value
      const linkRect = emailLink ? emailLink.getBoundingClientRect() : null;
      const valRect = detailVal ? detailVal.getBoundingClientRect() : null;

      return {
        viewportWidth: windowWidth,
        clientWidth: clientWidth,
        scrollWidth: scrollWidth,
        horizontalOverflowPx: horizontalOverflow,
        detailValue: {
          wordBreak: valStyle ? valStyle.wordBreak : null,
          overflowWrap: valStyle ? valStyle.overflowWrap : null,
          width: valRect ? valRect.width : null,
          right: valRect ? valRect.right : null,
        },
        mailtoLink: {
          wordBreak: linkStyle ? linkStyle.wordBreak : null,
          overflowWrap: linkStyle ? linkStyle.overflowWrap : null,
          width: linkRect ? linkRect.width : null,
          right: linkRect ? linkRect.right : null,
          href: emailLink ? emailLink.getAttribute('href') : null,
          text: emailLink ? emailLink.innerText : null,
        }
      };
    });

    console.log('=== EMPIRICAL TEST RESULTS (Requirement 5b - 320px) ===');
    console.log(JSON.stringify(results, null, 2));

    // Assertions
    expect(results.detailValue.wordBreak, '.detail-value wordBreak should be break-word').toBe('break-word');
    expect(results.detailValue.overflowWrap, '.detail-value overflowWrap should be break-word').toBe('break-word');
    expect(results.mailtoLink.wordBreak, 'mailto link wordBreak should be break-word').toBe('break-word');
    expect(results.mailtoLink.overflowWrap, 'mailto link overflowWrap should be break-word').toBe('break-word');

    expect(results.horizontalOverflowPx, 'Horizontal overflow on 320px viewport should be 0px').toBe(0);
    expect(results.mailtoLink.right, 'Email link right boundary should not exceed 320px').toBeLessThanOrEqual(320);
  });

});
