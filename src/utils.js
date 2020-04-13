const fs = require('fs');

module.exports.parseImportPath = (path) => {
    const matches = path.trim().match(/^['"](.+?)['"](.*)/);
    return matches[1];
};

module.exports.readFile = (file) =>
    new Promise((resolve, reject) => {
        fs.readFile(file, 'utf-8', (err, contents) => {
            if (err) {
                return reject(err);
            }
            return resolve(contents);
        });
    });

module.exports.replaceClassName = (from, oldClassName, newClassName) =>
    from
        .split(' ')
        .map((group) =>
            group
                .split('.')
                .map((className) =>
                    className === oldClassName.slice(1) ? newClassName.slice(1) : className,
                )
                .join('.'),
        )
        .map((className) => (className === oldClassName ? newClassName : className))
        .join(' ');
