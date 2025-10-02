const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  const errors = [];
  page.on('pageerror', error => {
    console.log('❌ PAGE ERROR:', error.message);
    errors.push(error.message);
  });

  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.log('❌ CONSOLE ERROR:', msg.text());
    }
  });

  const filePath = 'file:///C:/Repos/Sean/seantech/index.html';
  console.log('🔄 Loading:', filePath);

  try {
    await page.goto(filePath, { waitUntil: 'networkidle' });
    await page.waitForTimeout(3000);

    console.log('\n✅ Page loaded successfully!');

    // Check Solutions section
    const solutionsVisible = await page.isVisible('#solutions');
    const solutionsMasonry = await page.isVisible('.row.masonry');
    const solutionsItems = await page.$$eval('#solutions .col-md-3.item-block', items => items.length);

    console.log('\n📦 Solutions Section:');
    console.log('  - Section visible:', solutionsVisible ? '✓' : '✗');
    console.log('  - Masonry layout:', solutionsMasonry ? '✓' : '✗');
    console.log('  - Solution items:', solutionsItems);

    // Check Frameworks section
    const frameworksVisible = await page.isVisible('#frameworks');
    const frameworkCards = await page.$$eval('#frameworks .article-card', items => items.length);

    console.log('\n🚀 Frameworks Section:');
    console.log('  - Section visible:', frameworksVisible ? '✓' : '✗');
    console.log('  - Framework cards:', frameworkCards);

    // Check Resume section
    const resumeVisible = await page.isVisible('#resume');
    const resumeBoxes = await page.$$eval('#resume .resume-boxe.masonry', items => items.length);

    console.log('\n📄 Resume Section:');
    console.log('  - Section visible:', resumeVisible ? '✓' : '✗');
    console.log('  - Resume boxes:', resumeBoxes);

    // Check for errors
    console.log('\n🔍 Error Check:');
    console.log('  - Total JavaScript errors:', errors.length);
    if (errors.length > 0) {
      errors.forEach((err, i) => console.log(`    ${i + 1}. ${err}`));
    } else {
      console.log('  ✅ No JavaScript errors detected');
    }

    // Take screenshots
    await page.screenshot({ path: 'test-solutions.png', clip: { x: 0, y: 600, width: 1280, height: 800 } });
    await page.screenshot({ path: 'test-frameworks.png', clip: { x: 0, y: 1800, width: 1280, height: 800 } });
    await page.screenshot({ path: 'test-resume.png', clip: { x: 0, y: 3800, width: 1280, height: 800 } });

    console.log('\n📸 Screenshots saved:');
    console.log('  - test-solutions.png');
    console.log('  - test-frameworks.png');
    console.log('  - test-resume.png');

  } catch (error) {
    console.error('❌ Error:', error.message);
  }

  await page.waitForTimeout(2000);
  await browser.close();
  console.log('\n✅ Test complete!');
})();
