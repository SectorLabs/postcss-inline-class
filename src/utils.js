const fs = require('fs');

module.exports.parseImportPath = (path) => {
    const matches = path.trim().match(/^['"](.+?)['"](.*)/);
    return matches[1];
};

module.exports.readFile = (file) => {
    return new Promise((resolve, reject) => {
        fs.readFile(file, 'utf-8', (err, contents) => {
            if (err) {
                return reject(err);
            }
            return resolve(contents);
        });
    });
};
