const path = require('path');

const postcss = require('postcss');
const resolvePath = require('resolve');

const readFile = require('./utils').readFile;
const parseImportPath = require('./utils').parseImportPath;
const replaceClassName = require('./utils').replaceClassName;
const findInlineDeclarations = require('./findInlineDeclarations');
const findNestedRules = require('./findNestedRules');
const findMediaQueries = require('./findMediaQueries');

const resolveFile = (filePath, options) =>
    new Promise((resolve, reject) => {
        resolvePath(filePath, options, (err, path) => (err ? reject(err) : resolve(path)));
    });

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

const walkAtRule = (root, result, promises, resolve) => (atRule) => {
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
    promises.push(
        resolve(importPath)
            .then((resolvedPath) =>
                readFile(resolvedPath).then((rawData) => {
                    const importedRoot = postcss.parse(rawData);
                    return processAtRule(onError, atRule, importedRoot, targetClass, importPath);
                }),
            )
            .catch(() => {
                onError(`Could not find file '${importPath}'`);
                return [];
            }),
    );
};

const processFile = (root, result, paths) => (resolve) => {
    const fileResolver = (importPath) =>
        resolveFile(importPath, {
            basedir: path.dirname(root.source.input.file),
            paths,
        });

    const promises = [];
    const atRuleWalker = walkAtRule(root, result, promises, fileResolver);

    root.walkRules((rule) => rule.walkAtRules('inline', atRuleWalker));

    return Promise.all(promises)
        .then((newNodes) => {
            root.append(...newNodes);
            return resolve();
        })
        .catch(resolve);
};

const defaultOptions = Object.freeze({
    paths: [],
    extensions: [''],
});

module.exports = postcss.plugin('postcss-inline-class', (options) => {
    return (root, result) =>
        new Promise(processFile(root, result, (options || defaultOptions).paths));
});
