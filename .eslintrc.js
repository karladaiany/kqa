module.exports = {
    env: {
        browser: true,
        es2021: true,
        node: true
    },
    extends: [
        'eslint:recommended'
    ],
    parserOptions: {
        ecmaVersion: 12,
        sourceType: 'module'
    },
    rules: {
        'indent': ['error', 4],
        'linebreak-style': ['error', 'unix'],
        'quotes': ['error', 'single'],
        'semi': ['error', 'always'],
        'no-console': ['warn'],
        'no-unused-vars': ['warn'],
        'no-var': ['error'],
        'prefer-const': ['error'],
        'arrow-spacing': ['error'],
        'no-duplicate-imports': ['error'],
        'no-useless-constructor': ['error'],
        'no-extra-semi': ['error'],
        'no-multiple-empty-lines': ['error', { max: 1 }],
        'space-before-blocks': ['error', 'always'],
        'space-before-function-paren': ['error', 'always'],
        'space-in-parens': ['error', 'never'],
        'spaced-comment': ['error', 'always'],
        'template-curly-spacing': ['error', 'never'],
        'yoda': ['error', 'never']
    }
}; 