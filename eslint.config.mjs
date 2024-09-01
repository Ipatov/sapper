import globals from "globals";
import pluginJs from "@eslint/js";
import jestPlugin from "eslint-plugin-jest";

export default [
  {
    ignores: ['dist/', 'dist/*', 'coverage/', 'coverage/*', 'node_modules/', 'node_modules/*']
  },
  {
    files: ["**/*.js"],
    languageOptions: {
      sourceType: "module",
      ecmaVersion: 2022,
      globals: {
        ...globals.browser,
        ...globals.node
      }
    },
    rules: {
      // Добавьте это правило
      "indent": ["error", 2],
      // стили переносов строк
      "linebreak-style": ["error", "unix"],
      // одинарные ковычки
      "quotes": ["error", "single"],
      // точко с запятой в конце строеи
      "semi": ["error", "always"],
      // отсутствия пробелов в конце строки
      "no-trailing-spaces": "error",
      // пустая строка в конце файла
      "eol-last": ["error", "always"],
    }
  },
  {
    files: ["tests/**/*.js", "**/*.test.js"],
    plugins: {
      jest: jestPlugin
    },
    languageOptions: {
      globals: {
        ...globals.jest
      }
    },
    rules: {
      ...jestPlugin.configs.recommended.rules
    }
  },
  {
    files: ["webpack.config.js", "jest.config.js"],
    languageOptions: {
      sourceType: "commonjs",
      globals: {
        ...globals.node
      }
    }
  },
  pluginJs.configs.recommended
];