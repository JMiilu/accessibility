const pa11y = require('pa11y');

module.exports = async fileName => {
  const results = await pa11y(fileName, {
    // Issues with a type of warning are not directly actionable
    // and so they are excluded by default.
    includeWarnings: true,
    // Issues with a type of notice are not directly actionable
    // and so they are excluded by default.
    includeNotices: true
  });

  return results;
};
