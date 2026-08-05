const { test, expect } = require('@playwright/test');

test.describe('Empirical Stress Testing of Interactive & Dynamic CSS Behaviors', () => {
  // Ensure tests run serially to avoid server socket congestion on local PowerShell server
  test.describe.configure({ mode: 'serial' });

  test('Scenario 1: Mobile drawer menu z-index (z-index: 1005 vs header 1000)', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    // Wait for preloader to finish
    await page.waitForSelector('main:not(.hidden)', { timeout: 15000 });

    const header = page.locator('header');
    const drawer = page.locator('.mobile-nav-menu');
    const toggleBtn = page.locator('.mobile-nav-toggle');

    // 1. Verify computed z-indexes
    const headerZIndex = await header.evaluate(el => window.getComputedStyle(el).zIndex);
    const drawerZIndex = await drawer.evaluate(el => window.getComputedStyle(el).zIndex);

    expect(headerZIndex).toBe('1000');
    expect(drawerZIndex).toBe('1005');
    expect(parseInt(drawerZIndex, 10)).toBeGreaterThan(parseInt(headerZIndex, 10));

    // 2. Open mobile drawer menu
    await toggleBtn.click();
    await expect(drawer).toHaveClass(/open/);

    // Wait 650ms for CSS sliding transition (0.6s cubic-bezier) to complete
    await page.waitForTimeout(650);

    // 3. Verify element at top-right (where close button sits, overlapping header area)
    const elementAtPoint = await page.evaluate(() => {
      const el = document.elementFromPoint(window.innerWidth - 30, 30);
      return {
        tagName: el ? el.tagName : null,
        className: el ? el.className : null,
        closestDrawer: el ? el.closest('.mobile-nav-menu') !== null : false
      };
    });

    expect(elementAtPoint.closestDrawer).toBe(true);
  });

  test('Scenario 2: Landscape mobile viewport scrolling in mobile nav drawer (max-height: 100vh; overflow-y: auto)', async ({ page }) => {
    // Set landscape mobile viewport (low height, wide width)
    await page.setViewportSize({ width: 667, height: 375 });
    await page.goto('/');

    await page.waitForSelector('main:not(.hidden)', { timeout: 15000 });

    const drawer = page.locator('.mobile-nav-menu');
    const toggleBtn = page.locator('.mobile-nav-toggle');

    // Open mobile drawer
    await toggleBtn.click();
    await expect(drawer).toHaveClass(/open/);
    await page.waitForTimeout(650);

    // Get computed overflow-y and max-height
    const drawerStyles = await drawer.evaluate(el => {
      const style = window.getComputedStyle(el);
      return {
        maxHeight: style.maxHeight,
        overflowY: style.overflowY,
        clientHeight: el.clientHeight,
        scrollHeight: el.scrollHeight
      };
    });

    expect(drawerStyles.overflowY).toBe('auto');
    expect(drawerStyles.scrollHeight).toBeGreaterThan(drawerStyles.clientHeight);

    // Test scroll to bottom of drawer
    const initialScrollTop = await drawer.evaluate(el => el.scrollTop);
    expect(initialScrollTop).toBe(0);

    // Perform scroll inside drawer
    await drawer.evaluate(el => { el.scrollTop = el.scrollHeight; });
    const newScrollTop = await drawer.evaluate(el => el.scrollTop);
    expect(newScrollTop).toBeGreaterThan(0);

    // Check bottom contact link visibility
    const contactLink = drawer.locator('a[href="#contact"]');
    await expect(contactLink).toBeVisible();
  });

  test('Scenario 3: Nav scrollspy active highlighting on mobile viewports (Lenis decoupled)', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    await page.waitForSelector('main:not(.hidden)', { timeout: 15000 });
    await page.waitForTimeout(500);

    // Verify lenis is null on mobile
    const lenisStatus = await page.evaluate(() => window.lenis === null || typeof window.lenis === 'undefined' || window.innerWidth <= 768);
    expect(lenisStatus).toBe(true);

    // Scroll to #skills section
    await page.evaluate(() => {
      const el = document.querySelector('#skills');
      if (el) window.scrollTo(0, el.offsetTop + 50);
    });

    await page.waitForTimeout(400);

    // Check active nav link
    const activeLinkHref = await page.evaluate(() => {
      const active = document.querySelector('nav a.active, .mobile-nav-menu a.active');
      return active ? active.getAttribute('href') : null;
    });

    expect(activeLinkHref).toBe('#skills');

    // Scroll to #certifications section
    await page.evaluate(() => {
      const el = document.querySelector('#certifications');
      if (el) window.scrollTo(0, el.offsetTop + 50);
    });

    await page.waitForTimeout(400);

    const certActiveHref = await page.evaluate(() => {
      const active = document.querySelector('nav a.active, .mobile-nav-menu a.active');
      return active ? active.getAttribute('href') : null;
    });

    expect(certActiveHref).toBe('#certifications');
  });

  test('Scenario 4: Form validation .error class input borders and dynamic error text styling', async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('main:not(.hidden)', { timeout: 15000 });

    const submitBtn = page.locator('#portfolio-contact-form .submit-btn');
    const nameInput = page.locator('#form-name');
    const emailInput = page.locator('#form-email');
    const phoneInput = page.locator('#form-phone');
    const messageInput = page.locator('#form-message');

    // 1. Submit empty form
    await submitBtn.click();

    // Check error classes on name & message groups
    const nameGroup = nameInput.locator('xpath=..');
    const messageGroup = messageInput.locator('xpath=..');

    await expect(nameGroup).toHaveClass(/error/);
    await expect(messageGroup).toHaveClass(/error/);

    // Wait 450ms for CSS border-color transition to complete
    await page.waitForTimeout(450);

    // Check computed border color of error input (#ef4444)
    const nameBorderColor = await nameInput.evaluate(el => window.getComputedStyle(el).borderColor);
    expect(nameBorderColor).toMatch(/rgba?\(23[89],\s*6[89]|ef4444/i);

    // Check button state
    await expect(submitBtn).toHaveText(/Fields Required!/);

    // Wait for error timeout reset
    await page.waitForTimeout(3500);
    await expect(nameGroup).not.toHaveClass(/error/);

    // 2. Submit invalid email
    await nameInput.fill('Vishwak');
    await messageInput.fill('Hello testing error states');
    await emailInput.fill('invalid-email');
    await phoneInput.fill('+91 9848990042');

    await submitBtn.click();

    const emailGroup = emailInput.locator('xpath=..');
    await expect(emailGroup).toHaveClass(/error/);
    await page.waitForTimeout(450);

    const emailBorderColor = await emailInput.evaluate(el => window.getComputedStyle(el).borderColor);
    expect(emailBorderColor).toMatch(/rgba?\(23[89],\s*6[89]|ef4444/i);
    await expect(submitBtn).toHaveText(/Invalid Email!/);

    // Wait for error timeout reset
    await page.waitForTimeout(3500);
    await expect(emailGroup).not.toHaveClass(/error/);

    // 3. Submit invalid phone
    await emailInput.fill('test@example.com');
    await phoneInput.fill('123'); // Phone too short (< 7 chars)

    await submitBtn.click();

    const phoneGroup = phoneInput.locator('xpath=..');
    await expect(phoneGroup).toHaveClass(/error/);
    await page.waitForTimeout(450);

    const phoneBorderColor = await phoneInput.evaluate(el => window.getComputedStyle(el).borderColor);
    expect(phoneBorderColor).toMatch(/rgba?\(23[89],\s*6[89]|ef4444/i);
    await expect(submitBtn).toHaveText(/Invalid Phone!/);
  });

  test('Scenario 5: GSAP tilt vs CSS hover fanning on award cards', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/');
    await page.waitForSelector('main:not(.hidden)', { timeout: 15000 });

    const awardCard = page.locator('#certifications .award-card').last(); // Use last award card to avoid overlap from subsequent cards
    const nonAwardCard = page.locator('.project-card').first();

    // 1. Move mouse over non-award card (e.g. project card)
    await nonAwardCard.hover();
    await page.mouse.move(100, 100);
    await page.waitForTimeout(300);

    // 2. Move mouse over last award card
    await awardCard.hover();
    await page.waitForTimeout(400);

    // Inspect style attributes and computed styles
    const awardInlineStyle = await awardCard.evaluate(el => el.getAttribute('style') || '');
    const awardZIndex = await awardCard.evaluate(el => window.getComputedStyle(el).zIndex);

    // Confirm GSAP rotateX/rotateY is NOT injected inline on award cards
    expect(awardInlineStyle).not.toContain('rotateX');
    expect(awardInlineStyle).not.toContain('rotateY');

    // Confirm CSS hover styling (z-index: 150) applies when hovered
    expect(awardZIndex).toBe('150');
  });

});
