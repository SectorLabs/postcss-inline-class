const path = require('path');

module.exports = {
    'basic/test': {
        message: 'can inline rules from same file',
    },
    'fromOtherFile/test': {
        message: 'can inline rules from other file',
    },
    'copiesAllDeclarations/test': {
        message: 'copies all statements, even if they are spread throughout multiple blocks',
    },
    'removesRuleIfCannotFindClass/test': {
        message: 'removes statements that cannot be resolved',
        warnings: {
            text: "Could not find class '.c'",
        },
    },
    'removesRuleIfCannotFindClassInOtherFile/test': {
        message: 'removes statements that cannot be resolved in other files',
        warnings: {
            text: "Could not find class '.c' in file './dummy.css'",
        },
    },
    'removesRuleIfCannotFindFile/test': {
        message: 'removes statements if non-existent files are provided',
        warnings: {
            text: "Could not find file './dummy.css'",
        },
    },
    'doesNotOverwriteOverlappingNames/test': {
        message: 'does not overwrite overlapping names',
    },
    'supportsMediaQueries/test': {
        message: 'supportes media queries',
    },
    'supportsCombinatorSelectors/test': {
        message: 'supports combinator selectors',
    },
    'supportsMultipleClassSelector/test': {
        message: 'supports multiple class selectors',
    },
    'complex/test': {
        message: 'all combined',
    },
    'resolvesFiles/test': {
        message: 'knows how to resolve files',
        options: {
            paths: [
                path.join(process.cwd(), '/test/resolvesFiles/some/other/path'),
                path.join(process.cwd(), '/test/resolvesFiles/weird'),
            ],
        },
    },
};
