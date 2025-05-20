// eslint-disable-next-line no-undef
module.exports = {
  env: {
    browser: true, // Определяет глобальные переменные браузера
    es6: true, // Использование последних возможностей js
    jest: true, // Указывает, что тесты будут выполняться с использованием Jest, позволяя использовать глобальные переменные Jest
  },
  plugins: ['prettier', 'jest'],
  extends: [
    'eslint:recommended', // Рекомендуемые правила ESLint
    'plugin:react/recommended', // Рекомендуемые правила для React
    'plugin:jest/recommended',
    'prettier', // Интеграция Prettier с ESLint
  ],
  parserOptions: {
    ecmaVersion: 12, // Версия ECMAScript для синтаксического анализа
    sourceType: 'module', // Использование модульного синтаксиса
  },
  rules: {
    'prettier/prettier': 'error', // Отображение ошибок Prettier как ошибок ESLint
    'no-unused-vars': 'warn', // Устанавливает правило для предупреждения о неиспользуемых переменных
    'no-console': 'error', // Предупреждение при использовании console.log
    quotes: ['error', 'single'], // Использование одинарных кавычек
  },
  ignores: ['node_modules/**', '**/*.min.js', 'dist/**', 'build/**'],
};
