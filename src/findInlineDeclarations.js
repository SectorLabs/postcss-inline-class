const _ = require('lodash');

const findInlineDeclarations = (root, targetSelector) => {
    const inlineDeclarations = [];

    root.walkRules((rule) => {
        if (rule.selectors.includes(targetSelector) && rule.parent.type === 'root') {
            inlineDeclarations.push(rule);
        }
    });

    return _.flatten(inlineDeclarations.map((match) => match.clone().nodes));
};

module.exports = findInlineDeclarations;
