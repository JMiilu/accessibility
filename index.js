const path = require('path');
const fs = require('fs');

const analyzePuppeteer = require('./analyzers/puppeteer');
const analyzeAxe = require('./analyzers/axe');
const analyzePa11y = require('./analyzers/pa11y');
const analyzeA11y = require('./analyzers/a11y');
const reportAxe = require('./reporters/axe');
const reportPa11y = require('./reporters/pa11y');

const HTML_FILE = 'index.html';
const fileName = path.join(__dirname, HTML_FILE);

const writeResults = (fileName, data, json = true) => {
  fs.writeFile(
    fileName,
    json ? JSON.stringify(data, null, 2) : data,
    { encoding: 'utf8' },
    err => {
      if (err) console.error(err);
    }
  );
};

(async fileName => {
  const puppeteerSnapshot = await analyzePuppeteer(fileName);
  const axeResults = await analyzeAxe(fileName);
  const pa11yResults = await analyzePa11y(fileName);
  const a11yResults = await analyzeA11y(fileName);

  const axeHtml = reportAxe(axeResults);
  const pa11yHtml = reportPa11y(pa11yResults);

  writeResults('reports/puppeteer.json', puppeteerSnapshot);
  writeResults('reports/axe.json', axeResults);
  writeResults('reports/axe.html', axeHtml, false);
  writeResults('reports/pa11y.json', pa11yResults);
  writeResults('reports/pa11y.html', pa11yHtml, false);
  writeResults('reports/a11y.json', a11yResults);
})(fileName);
