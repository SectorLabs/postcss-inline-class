const path = require('path');
const fs = require('fs');

const postcss = require('postcss');
const _ = require('lodash');

const parseImportPath = (path) => {
    const matches = path.trim().match(/^['"](.+?)['"](.*)/);
    return matches[1];
};

const readFile = (file) => {
    return new Promise((resolve, reject) => {
        fs.readFile(file, 'utf-8', (err, contents) => {
            if (err) {
                return reject(err);
            }
            return resolve(contents);
        });
    });
};

const findClass = (root, selector) => {
    const matches = [];

    root.walkRules((rule) => {
        if (rule.selectors.includes(selector) && rule.parent.type === 'root') {
            matches.push(rule);
        }
    });

    return _.flatten(matches.map((match) => match.clone().nodes));
};

const walkRule = (root, result, promises) => (atRule) => {
    const params = atRule.params.split(' ');
    const targetClass = params[0];

    if (params.length > 1) {
        const importPath = parseImportPath(params.slice(-1)[0]);
        const resolvedPath = path.resolve(path.dirname(root.source.input.file), importPath);

        promises.push(
            readFile(resolvedPath)
                .then((data) => {
                    const targetRoot = postcss.parse(data);
                    const matches = findClass(targetRoot, targetClass);
                    if (matches.length === 0) {
                        atRule.warn(
                            result,
                            `Could not find class '${targetClass}' in file '${importPath}'`,
                        );
                    }
                    atRule.replaceWith(matches);
                })
                .catch(() => {
                    atRule.warn(result, `Could not find file '${importPath}'`);
                    atRule.remove();
                }),
        );
    } else {
        const match = findClass(root, targetClass);
        if (match.length === 0) {
            atRule.warn(result, `Could not find class '${targetClass}'`);
        }
        atRule.replaceWith(findClass(root, targetClass));
    }
};

const processFile = (root, result) => (resolve) => {
    const promises = [];

    const ruleWalker = walkRule(root, result, promises);

    root.walkRules((rule) => rule.walkAtRules('inline', ruleWalker));

    return Promise.all(promises)
        .then(() => resolve())
        .catch(() => resolve());
};

module.exports = postcss.plugin('postcss-inline-class', () => (root, result) =>
    new Promise(processFile(root, result)),
);
