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
  impact === 'critical' ? 'danger' : impact === 'serious' ? 'warning' : 'info';

module.exports = results => {
  const card = readFileSync(pathJoin(__dirname, CARD_FILE), {
    encoding: 'utf8'
  });

  const template = readFileSync(pathJoin(__dirname, TEMPLATE_FILE), {
    encoding: 'utf8'
  });

  const url = results.url;
  const violations = results.violations.filter(v => v.impact !== 'minor');

  const cards = violations.map((v, i) => {
    const id = `${i + 1}`.padStart(4, '0');
    const cardId = `violation${id}`;
    const collapseId = `collapse${id}`;
    const { help: title, description } = v;
    const type = getType(v.impact);

    const body =
      `<p class="lead">${description}</p>` +
      v.nodes
        .map(n => {
          const html = escape(n.html);

          const messages = n.any
            .filter(n => n.impact !== 'minor')
            .map(n => {
              const type = getType(n.impact);
              return `<li class="text-${type}">${escape(n.message)}</li>`;
            });

          return `<pre><code>${html}</code></pre><ul>${messages.join('')}</ul>`;
        })
        .join('');

    return card
      .replace(/CARD_ID/g, cardId)
      .replace(/COLLAPSE_ID/g, collapseId)
      .replace('CARD_TITLE', title)
      .replace('CARD_TYPE', type)
      .replace('CARD_BODY', body);
  });

  return template.replace(/URL/g, url).replace('RESULTS', cards.join('\n'));
};
