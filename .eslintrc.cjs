/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution')

module.exports = {
  root: true,
  extends: [
    'plugin:vue/vue3-essential',
    'eslint:recommended',
    '@vue/eslint-config-prettier/skip-formatting',
    'prettier'
  ],
  plugins: [`prettier`],
  parserOptions: {
    sourceType: `module`,
    ecmaVersion: 'latest'
  },
  env: {
    node: true,
    es2020: true
  }
}
