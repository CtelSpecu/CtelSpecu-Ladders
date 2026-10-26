import js from '@eslint/js'
import tseslint from 'typescript-eslint'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'

export default tseslint.config(
  {
    ignores: [
      'dist',
      'node_modules',
      'src/routeTree.gen.ts',
      'scripts/**/*.mjs',
      '*.config.js',
    ],
  },
  {
    files: ['**/*.{ts,tsx}'],
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    languageOptions: {
      ecmaVersion: 2022,
      globals: { window: 'readonly', document: 'readonly', localStorage: 'readonly' },
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
    },
  },
  {
    // shadcn 生成的原语会导出 variants，Provider/Hook 模块本就是「组件 + Hook」同文件，
    // 这两种情况不适用 Fast Refresh 的单组件约束。
    files: [
      'src/components/ui/**/*.tsx',
      'src/lib/**/*.{ts,tsx}',
      'src/components/onboarding/onboarding-provider.tsx',
    ],
    rules: {
      'react-refresh/only-export-components': 'off',
    },
  },
)
