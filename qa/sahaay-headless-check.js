const { chromium } = require('playwright');

const baseURL = process.env.SAHAAY_BASE_URL || 'http://localhost:8001';

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

async function expectText(page, selector, text, label) {
  const actual = await page.locator(selector).textContent();
  assert(actual && actual.includes(text), `${label}: expected "${text}", got "${actual}"`);
}

async function withConsoleWatch(page, taskName, callback) {
  const errors = [];
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text());
  });
  page.on('pageerror', (error) => errors.push(error.message));
  await callback();
  assert(errors.length === 0, `${taskName}: console/page errors: ${errors.join(' | ')}`);
}

async function run() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();

  try {
    const page = await context.newPage();

    await withConsoleWatch(page, 'landing desktop', async () => {
      await page.goto(`${baseURL}/index.html`, { waitUntil: 'networkidle' });
      assert((await page.title()).includes('Sahaay'), 'landing: title should include Sahaay');
      await expectText(page, '.path-kicker', 'Recommended evaluation path', 'landing path panel');
      await expectText(page, '.demo-action-note', 'Preview only', 'quick console note');
      assert(await page.getByRole('link', { name: /Start 3-minute evaluator simulation/i }).first().isVisible(), 'primary evaluator CTA should be visible');
      const faviconHref = await page.locator('link[rel="icon"]').getAttribute('href');
      assert(faviconHref && faviconHref.includes('sahaay-mark-logo-transparent.png'), `landing: wrong favicon ${faviconHref}`);
      const brandLogoSrc = await page.locator('.brand-logo').getAttribute('src');
      assert(brandLogoSrc && brandLogoSrc.includes('sahaay-logo-transparent.png'), `landing: wrong brand logo ${brandLogoSrc}`);
      const heroSrc = await page.locator('.hero-visual-image > img:not(.hero-logo-overlay)').getAttribute('src');
      assert(heroSrc && heroSrc.includes('sahaay-hero-app-v4.png'), `landing: wrong hero src ${heroSrc}`);
      const heroLogoSrc = await page.locator('.hero-logo-overlay').getAttribute('src');
      assert(heroLogoSrc && heroLogoSrc.includes('sahaay-logo-transparent.png'), `landing: wrong hero logo overlay ${heroLogoSrc}`);
      const heroRatio = await page.locator('.hero-visual-image').evaluate((element) => {
        const rect = element.getBoundingClientRect();
        return rect.width / rect.height;
      });
      assert(Math.abs(heroRatio - 1624 / 969) < 0.08, `landing: hero aspect ratio mismatch ${heroRatio}`);
      await expectText(page, '.mockup-badge', 'Hybrid emergency-response app', 'hero badge');
      await expectText(page, '#safety', 'Sahaay scales as a human-controlled layer', 'safe-scale section');
      await expectText(page, '#safety', 'AI supports triage; dispatchers decide.', 'safe-scale human control card');
    });

    await withConsoleWatch(page, 'simulation controls', async () => {
      await page.goto(`${baseURL}/simulation.html`, { waitUntil: 'networkidle' });
      assert(await page.locator('#startSimulation').isVisible(), 'simulation: start button visible');
      await page.locator('#narrationToggle').uncheck();
      await page.locator('#startSimulation').click();
      assert((await page.locator('body').getAttribute('class')).includes('journey-mode'), 'simulation: should enter journey mode');
      assert(await page.locator('#exitJourney').isVisible(), 'simulation: exit full view visible');
      await expectText(page, '#stepTitle', 'Tree-rescue simulation ready', 'simulation initial beat');
      await page.locator('#pauseSimulation').click();
      await expectText(page, '#audioStatus', 'Paused by evaluator', 'simulation pause');
      await page.locator('#stepSimulation').click();
      await expectText(page, '#stepTitle', 'Maya reports the incident', 'simulation step forward');
      assert((await page.locator('#dispatcherDevice').getAttribute('class')).includes('active'), 'dispatcher device should become active');
      await page.locator('#exitJourney').click();
      assert(!(await page.locator('body').getAttribute('class')).includes('journey-mode'), 'simulation: should exit journey mode');
    });

    await withConsoleWatch(page, 'simulation call ring', async () => {
      await page.goto(`${baseURL}/simulation.html`, { waitUntil: 'networkidle' });
      await page.locator('.step-jump button[data-step="1"]').click();
      await page.locator('#continueSimulation').click();
      await expectText(page, '#audioStatus', 'Incoming reporter call ringing', 'simulation ring status');
      await expectText(page, '#callBridgeStatus', 'Incoming reporter call', 'simulation ring bridge status');
      await expectText(page, '#spokenCaption', 'Ring… Maya’s one-tap report is connecting', 'simulation ring caption');
      assert((await page.locator('.call-bridge-panel').getAttribute('class')).includes('ringing'), 'call bridge should show ringing state');
      await page.waitForTimeout(2200);
      await expectText(page, '#stepTitle', 'Maya reports the incident', 'simulation should stay on Maya after ring');
      await expectText(page, '#audioStatus', 'Playing Maya line', 'simulation should play Maya after ring');
      assert(!(await page.locator('.call-bridge-panel').getAttribute('class')).includes('ringing'), 'call bridge ringing state should stop');
      await page.locator('#pauseSimulation').click();
    });

    await withConsoleWatch(page, 'role gateway', async () => {
      await page.goto(`${baseURL}/demo-login.html`, { waitUntil: 'networkidle' });
      await expectText(page, '.simulation-entry h2', 'Start with the 3-minute evaluator simulation.', 'role gateway recommendation');
      const gatewayMark = await page.locator('.brand-mark-img').first().getAttribute('src');
      assert(gatewayMark && gatewayMark.includes('sahaay-mark-logo-transparent.png'), `role gateway: wrong brand mark ${gatewayMark}`);
      await page.getByRole('button', { name: /Launch dispatcher view/i }).click();
      assert(page.url().includes('role=dispatcher'), `dispatcher launch URL mismatch: ${page.url()}`);
      await expectText(page, '#viewTitle', 'Dispatcher view', 'dispatcher view title');
      await expectText(page, '#assignRecommended', 'Dispatch Fire + EMS + Police', 'dispatcher recommended dispatch');
      await page.goto(`${baseURL}/demo-view.html?role=unit`, { waitUntil: 'networkidle' });
      await expectText(page, '#viewTitle', 'Response unit view', 'unit view title');
      const routeSrc = await page.locator('.route-map img').getAttribute('src');
      assert(routeSrc && routeSrc.includes('incident-map-evaluator-v2.jpg'), `unit route map src mismatch: ${routeSrc}`);
      await page.locator('#handoffComplete').click();
      assert(await page.locator('#handoffClosurePanel').isVisible(), 'unit closure panel should open');
    });

    await withConsoleWatch(page, 'landing mobile', async () => {
      await page.setViewportSize({ width: 390, height: 844 });
      await page.goto(`${baseURL}/index.html`, { waitUntil: 'networkidle' });
      const headerAlpha = await page.locator('.site-header').evaluate((element) => {
        const background = getComputedStyle(element).backgroundColor;
        const match = background.match(/rgba?\(([^)]+)\)/);
        if (!match) return 0;
        const parts = match[1].split(',').map((value) => Number.parseFloat(value.trim()));
        return parts.length === 4 ? parts[3] : 1;
      });
      assert(headerAlpha >= 0.9, `mobile header background should be solid enough, got alpha ${headerAlpha}`);
      assert(await page.locator('.menu-toggle').isVisible(), 'mobile hamburger menu should be visible');
      assert(!(await page.locator('#primaryNav').isVisible()), 'mobile nav should be closed initially');
      await page.locator('.menu-toggle').click();
      assert((await page.locator('.menu-toggle').getAttribute('aria-expanded')) === 'true', 'mobile hamburger should expand');
      await page.locator('#primaryNav').waitFor({ state: 'visible' });
      assert(await page.locator('#primaryNav').isVisible(), 'mobile nav should open after hamburger click');
      await expectText(page, '#primaryNav', 'Safety model', 'mobile nav contents');
      assert(await page.getByRole('link', { name: /Start 3-minute evaluator simulation/i }).first().isVisible(), 'mobile CTA should be visible');
      assert(await page.locator('.hero-visual-image > img:not(.hero-logo-overlay)').isVisible(), 'mobile hero image should be visible');
      const dimensions = await page.evaluate(() => ({
        innerWidth: window.innerWidth,
        scrollWidth: document.documentElement.scrollWidth,
      }));
      assert(dimensions.scrollWidth <= dimensions.innerWidth + 2, `mobile overflow: ${JSON.stringify(dimensions)}`);
    });

    console.log('HEADLESS_PLAYWRIGHT_QA_PASS');
  } finally {
    await browser.close();
  }
}

run().catch((error) => {
  console.error('HEADLESS_PLAYWRIGHT_QA_FAIL');
  console.error(error);
  process.exit(1);
});
