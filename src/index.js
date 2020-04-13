const path = require('path');

const postcss = require('postcss');

const readFile = require('./utils').readFile;
const parseImportPath = require('./utils').parseImportPath;
const replaceClassName = require('./utils').replaceClassName;
const findInlineDeclarations = require('./findInlineDeclarations');
const findNestedRules = require('./findNestedRules');
const findMediaQueries = require('./findMediaQueries');

const processAtRule = (onError, atRule, root, targetClass, importPath) => {
    const matchedDeclarations = findInlineDeclarations(root, targetClass);
    const nestedRules = findNestedRules(root, targetClass);
    const mediaQueries = findMediaQueries(root, targetClass);

    if (matchedDeclarations.length === 0 && nestedRules.length === 0) {
        if (importPath) {
            onError(`Could not find class '${targetClass}' in file '${importPath}'`);
            return [];
        } else {
            onError(`Could not find class '${targetClass}'`);
            return [];
        }
    }

    nestedRules.forEach((nestedRule) => {
        nestedRule.selector = replaceClassName(
            nestedRule.selector,
            targetClass,
            atRule.parent.selector,
        );
    });

    mediaQueries.forEach((mediaQuery) => {
        mediaQuery.nodes.forEach(
            (node) =>
                (node.selectors = node.selectors.map((selector) =>
                    replaceClassName(selector, targetClass, atRule.parent.selector),
                )),
        );
    });

    atRule.replaceWith(matchedDeclarations);
    return [...nestedRules, ...mediaQueries];
};

const walkAtRule = (root, result, promises) => (atRule) => {
    const params = postcss.list.space(atRule.params);
    const targetClass = params[0];

    const onError = (message) => {
        atRule.warn(result, message);
        atRule.remove();
    };

    if (params.length === 1) {
        promises.push(Promise.resolve(processAtRule(onError, atRule, root, targetClass)));
        return;
    }

    const importPath = parseImportPath(params.slice(-1)[0]);
    const resolvedPath = path.resolve(path.dirname(root.source.input.file), importPath);

    promises.push(
        readFile(resolvedPath)
            .then((rawData) => {
                const importedRoot = postcss.parse(rawData);
                return processAtRule(onError, atRule, importedRoot, targetClass, importPath);
            })
            .catch(() => {
                onError(`Could not find file '${importPath}'`);
                return [];
            }),
    );
};

const processFile = (root, result) => (resolve) => {
    const promises = [];

    const atRuleWalker = walkAtRule(root, result, promises);

    root.walkRules((rule) => rule.walkAtRules('inline', atRuleWalker));

    return Promise.all(promises)
        .then((newNodes) => {
            root.append(...newNodes);
            return resolve();
        })
        .catch(resolve);
};

module.exports = postcss.plugin('postcss-inline-class', () => (root, result) =>
    new Promise(processFile(root, result)),
);
