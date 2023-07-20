module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
    'prettier',
  ],
  plugins: ['@typescript-eslint', 'react-hooks', 'prettier'],
  parserOptions: {
    sourceType: 'module',
  },
  rules: {
    'import/no-named-as-default': 0,
    'prettier/prettier': [
      'warn',
      {
        endOfLine: 'auto',
      },
    ],
    curly: 0,
    '@typescript-eslint/no-unused-vars': 1,
    'react-hooks/exhaustive-deps': 1,
    '@next/next/no-img-element': 0,
    'jsx-a11y/alt-text': 0,
    'react/display-name': 0,
    'import/no-anonymous-default-export': 0,
  },
  exclude: ['node_modules', 'lib'],
};
