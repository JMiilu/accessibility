const { readFileSync } = require('fs');
const { join: pathJoin } = require('path');

const TEMPLATE_FILE = 'template.html';
const CARD_FILE = 'card.html';

const escape = html => {
  return html
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
};

const getType = impact =>
  impact === 'error' ? 'danger' : impact === 'notice' ? 'info' : impact;

module.exports = results => {
  const card = readFileSync(pathJoin(__dirname, CARD_FILE), {
    encoding: 'utf8'
  });

  const template = readFileSync(pathJoin(__dirname, TEMPLATE_FILE), {
    encoding: 'utf8'
  });

  const url = results.pageUrl;
  const issues = results.issues.filter(i => i.type !== 'notice');

  const cards = issues.map((issue, i) => {
    const id = `${i + 1}`.padStart(4, '0');
    const cardId = `issue${id}`;
    const collapseId = `collapse${id}`;
    const { selector: title, context: html, message, type } = issue;

    let body = `<p class="lead">${message}</p>`;
    html && (body += `<pre><code>${escape(html)}</code></pre>`);

    return card
      .replace(/CARD_ID/g, cardId)
      .replace(/COLLAPSE_ID/g, collapseId)
      .replace('CARD_TITLE', title)
      .replace('CARD_TYPE', getType(type))
      .replace('CARD_BODY', body);
  });

  return template.replace(/URL/g, url).replace('RESULTS', cards.join('\n'));
};
