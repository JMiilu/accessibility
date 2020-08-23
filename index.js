const path = require('path');
const fs = require('fs');
const analyzePuppeteer = require('./analyzers/puppeteer');
const analyzeAxe = require('./analyzers/axe');
const analyzePa11y = require('./analyzers/pa11y');
const analyzeA11y = require('./analyzers/a11y');

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
  console.log('Analyze with Puppeteer');
  const puppeteerSnapshot = await analyzePuppeteer(fileName);
  writeResults('reports/puppeteer.json', puppeteerSnapshot);

  console.log('Analyze with Axe');
  const axeResults = await analyzeAxe(fileName);
  writeResults('reports/axe.json', axeResults);

  console.log('Analyze with Pa11y');
  const pa11yResults = await analyzePa11y(fileName);
  writeResults('reports/pa11y.json', pa11yResults);

  console.log('Analyze with A11y');
  const a11yResults = await analyzeA11y(fileName);
  writeResults('reports/a11y.json', a11yResults);
})(fileName);
