import vue from 'eslint-plugin-vue';

export default [
  {
    ignores: ['dist/**', 'node_modules/**'],
  },
  ...vue.configs['flat/essential'],
  {
    rules: {
      'no-console': 'off',
      'vue/multi-word-component-names': 'off',
    },
  },
];
