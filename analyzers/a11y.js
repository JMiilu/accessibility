const util = require('util');
const a11y = require('a11y');

module.exports = async fileName => {
  const analyze = util.promisify(a11y);
  const results = await analyze(fileName);

  return {
    audit: results.audit.filter(e => e.result === 'FAIL'),
    report: results.report
  };
};
