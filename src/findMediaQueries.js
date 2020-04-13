const _ = require('lodash');

const findMediaQueries = (root, targetSelector) => {
    const mediaQueries = [];

    root.walkAtRules((atRule) => {
        if (atRule.name !== 'media') {
            return;
        }

        const mediaQuery = atRule.clone();
        const newNodes = [];

        mediaQuery.walkRules((rule) => {
            if (rule.selectors.includes(targetSelector)) {
                newNodes.push(rule.clone());
                return;
            }

            const isNestedRule = rule.selectors.find((selector) =>
                selector.includes(targetSelector),
            );
            if (isNestedRule) {
                newNodes.push(rule.clone());
            }
        });

        if (newNodes.length === 0) {
            return;
        }

        mediaQuery.nodes = newNodes;
        mediaQueries.push(mediaQuery);
    });

    return _.flatten(mediaQueries.map((match) => match.clone()));
};

module.exports = findMediaQueries;
