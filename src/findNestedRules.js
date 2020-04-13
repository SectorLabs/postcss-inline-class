const _ = require('lodash');

const findNestedRules = (root, targetSelector) => {
    const nestedMatches = [];

    root.walkRules((rule) => {
        if (rule.parent.type !== 'root') {
            return;
        }

        if (rule.selectors.includes(targetSelector)) {
            return;
        }

        const isNestedRule = rule.selectors.find((selector) => selector.includes(targetSelector));

        if (isNestedRule) {
            nestedMatches.push(rule.clone());
        }
    });

    return _.flatten(nestedMatches.map((match) => match.clone()));
};

module.exports = findNestedRules;
