const { AxePuppeteer } = require('axe-puppeteer');
const puppeteer = require('puppeteer');

module.exports = async fileName => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setBypassCSP(true);

  await page.goto(`file://${fileName}`);

  const results = await new AxePuppeteer(page).analyze();

  await page.close();
  await browser.close();
  return results;
};
