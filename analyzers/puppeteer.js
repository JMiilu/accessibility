const puppeteer = require('puppeteer');

module.exports = async fileName => {
  const browser = await puppeteer.launch({
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-gpu',
      '--disable-dev-shm-usage'
    ]
  });

  const page = await browser.newPage();
  await page.goto(`file://${fileName}`);

  const snapshot = await page.accessibility.snapshot();

  browser.close();
  return snapshot;
};
