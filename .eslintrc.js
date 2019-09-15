module.exports = {
  root: true,
  env: {
    browser: true,
  },
  plugins: [
  ],
  extends: [
    'plugin:vue/essential',
    '@vue/airbnb',
    '@vue/typescript',
  ],
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',

    'import/prefer-default-export': 'off',
    'no-restricted-syntax': 'off',
    'no-await-in-loop': 'off',
    'no-plusplus': 'off',
    'no-continue': 'off',
    'func-names': ['warn', 'as-needed'],
  },
  parserOptions: {
    parser: '@typescript-eslint/parser',
  },
};
