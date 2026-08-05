const { test, expect } = require('@playwright/test');

const BREAKPOINTS = [320, 360, 414, 768, 1024, 1280, 1440];

test.describe('M3.1 Empirical Stress Testing', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('#preloader.loaded', { timeout: 15000 }).catch(() => {});
    await page.waitForTimeout(500);
  });

  // 1. Horizontal Scroll Overflow Protection
  for (const width of BREAKPOINTS) {
    test(`1. Horizontal scroll overflow protection at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 800 });
      await page.waitForTimeout(300);

      const res = await page.evaluate((vpWidth) => {
        const docWidth = document.documentElement.clientWidth;
        const scrollWidth = document.documentElement.scrollWidth;

        const overflowers = [];
        document.querySelectorAll('*').forEach(el => {
          const r = el.getBoundingClientRect();
          if (r.width > 0 && r.right > vpWidth + 1) {
            overflowers.push({
              tag: el.tagName.toLowerCase(),
              id: el.id,
              cls: el.className,
              right: Math.round(r.right),
              width: Math.round(r.width)
            });
          }
        });

        return { vpWidth, docWidth, scrollWidth, hasOverflow: scrollWidth > docWidth, overflowers };
      }, width);

      console.log(`[${width}px] Overflow result:`, res);
      expect(res.hasOverflow).toBe(false);
      expect(res.scrollWidth).toBeLessThanOrEqual(width);
    });
  }

  // 2. Projects Grid Layout at 320px
  test('2. Projects grid layout at 320px width', async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 800 });
    await page.waitForTimeout(300);

    const res = await page.evaluate(() => {
      const grid = document.querySelector('.projects-grid');
      if (!grid) return null;
      const style = window.getComputedStyle(grid);
      const gridRect = grid.getBoundingClientRect();
      const cards = Array.from(grid.querySelectorAll('.project-card')).map(c => {
        const r = c.getBoundingClientRect();
        return { width: r.width, right: r.right };
      });
      return {
        gridTemplateColumns: style.gridTemplateColumns,
        gridWidth: gridRect.width,
        cards
      };
    });

    console.log('[320px] Projects Grid:', res);
    expect(res).not.toBeNull();
    expect(res.gridWidth).toBeLessThanOrEqual(320);
    res.cards.forEach(c => {
      expect(c.right).toBeLessThanOrEqual(320 + 1);
    });
  });

  // 3. Skills 3D TagCloud Canvas Bounds at 320px
  test('3. Skills 3D TagCloud canvas bounds at 320px', async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 800 });
    await page.waitForTimeout(500);

    const res = await page.evaluate(() => {
      const wrapper = document.querySelector('.sphere-wrapper');
      const sphere = document.querySelector('#skill-sphere');
      const tagcloud = document.querySelector('.tagcloud');

      const wRect = wrapper ? wrapper.getBoundingClientRect() : null;
      const sRect = sphere ? sphere.getBoundingClientRect() : null;
      const tRect = tagcloud ? tagcloud.getBoundingClientRect() : null;

      const wStyle = wrapper ? window.getComputedStyle(wrapper) : null;

      return {
        wrapperOverflow: wStyle ? wStyle.overflow : null,
        wrapperWidth: wRect ? wRect.width : null,
        sphereWidth: sRect ? sRect.width : null,
        tagcloudRight: tRect ? tRect.right : null,
        tagcloudLeft: tRect ? tRect.left : null
      };
    });

    console.log('[320px] TagCloud Canvas:', res);
    expect(res.wrapperOverflow).toBe('hidden');
    expect(res.wrapperWidth).toBeLessThanOrEqual(320);
    if (res.tagcloudRight) {
      expect(res.tagcloudRight).toBeLessThanOrEqual(320 + 1);
    }
  });

  // 4. Experience Timeline Line & Dot Positioning
  for (const width of BREAKPOINTS) {
    test(`4. Experience timeline line & dot alignment at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 800 });
      await page.waitForTimeout(300);

      const res = await page.evaluate((vpWidth) => {
        const container = document.querySelector('.timeline-container');
        if (!container) return null;
        const containerRect = container.getBoundingClientRect();

        // Check CSS rule matching: @media (max-width: 768px)
        const isMobileOrTabletMobile = vpWidth <= 768;
        const isSmallMobile = vpWidth <= 480;

        // Calculate actual computed line X center and dot X center
        // Line position relative to container:
        let lineOffsetLeft = containerRect.width / 2; // desktop default 50%
        if (isSmallMobile) {
          lineOffsetLeft = 12;
        } else if (isMobileOrTabletMobile) {
          lineOffsetLeft = 20;
        }

        const lineCenterX = containerRect.left + lineOffsetLeft;

        const dots = Array.from(document.querySelectorAll('.timeline-dot')).map((dot, idx) => {
          const r = dot.getBoundingClientRect();
          const dotCenterX = r.left + r.width / 2;
          const delta = Math.abs(dotCenterX - lineCenterX);
          return { idx, dotCenterX, lineCenterX, delta: Math.round(delta * 10) / 10 };
        });

        return { vpWidth, containerRect, lineCenterX, dots };
      }, width);

      console.log(`[${width}px] Timeline Alignment:`, JSON.stringify(res));
      expect(res).not.toBeNull();
      res.dots.forEach(d => {
        expect(d.delta, `Dot ${d.idx} misalignment at ${width}px`).toBeLessThanOrEqual(3);
      });
    });
  }

  // 5a. Glass card padding scaling
  test('5a. Glass card padding scaling on small screens', async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 800 });
    await page.waitForTimeout(300);

    const res = await page.evaluate(() => {
      const baseGlassCard = document.querySelector('.glass-card');
      const style = window.getComputedStyle(baseGlassCard);
      return {
        paddingTop: style.paddingTop,
        paddingRight: style.paddingRight,
        paddingBottom: style.paddingBottom,
        paddingLeft: style.paddingLeft
      };
    });

    console.log('[360px] Base Glass Card Padding:', res);
    expect(res.paddingTop).toBe('20px');
    expect(res.paddingRight).toBe('16px');
    expect(res.paddingBottom).toBe('20px');
    expect(res.paddingLeft).toBe('16px');
  });

  // 5b. Email text wrapping
  test('5b. Email text wrapping (word-break: break-word)', async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 800 });
    await page.waitForTimeout(300);

    const res = await page.evaluate(() => {
      const emailLink = document.querySelector('a[href^="mailto:"]');
      const detailVal = emailLink ? emailLink.closest('.detail-value') : null;

      const linkStyle = emailLink ? window.getComputedStyle(emailLink) : null;
      const valStyle = detailVal ? window.getComputedStyle(detailVal) : null;

      return {
        linkWordBreak: linkStyle ? linkStyle.wordBreak : null,
        linkOverflowWrap: linkStyle ? linkStyle.overflowWrap : null,
        valWordBreak: valStyle ? valStyle.wordBreak : null,
        valOverflowWrap: valStyle ? valStyle.overflowWrap : null
      };
    });

    console.log('[320px] Email Text CSS:', res);
    const wb = res.linkWordBreak || res.valWordBreak;
    const ow = res.linkOverflowWrap || res.valOverflowWrap;

    const hasBreakWord = (wb === 'break-word' || wb === 'break-all' || ow === 'break-word' || ow === 'anywhere');
    expect(hasBreakWord, `Email text styling missing word-break: break-word! Found wordBreak=${wb}, overflowWrap=${ow}`).toBe(true);
  });

});
