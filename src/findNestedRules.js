const _ = require('lodash');

const findNestedRules = (root, targetSelector) => {
    const nestedMatches = [];

    root.walkRules((rule) => {
        if (rule.selectors.includes(targetSelector) && rule.parent.type === 'root') {
            return;
        }

        const isNestedRule =
            rule.selectors.find((selector) => selector.includes(targetSelector)) &&
            rule.parent.type === 'root';

        if (isNestedRule) {
            nestedMatches.push(rule);
        }
    });

    return _.flatten(nestedMatches.map((match) => match.clone()));
};

module.exports = findNestedRules;
