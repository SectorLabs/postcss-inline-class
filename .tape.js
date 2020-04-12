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
};
