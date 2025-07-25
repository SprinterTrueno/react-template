import globals from "globals";
import tseslint from "typescript-eslint";
import reactHooks from "eslint-plugin-react-hooks";
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended";
import eslintConfigAirbnb from "./test/index.mjs";

export default tseslint.config(
  {
    name: "languageOptions",
    languageOptions: { globals: globals.browser }
  },
  eslintConfigAirbnb,
  reactHooks.configs["recommended-latest"],
  tseslint.configs.strict,
  eslintPluginPrettierRecommended,
  {
    name: "ignores",
    ignores: ["src/react-app-env.d.ts"]
  },
  {
    name: "settings",
    settings: {
      "import/resolver": {
        webpack: {
          // 这里的 config 就是我们 webpack 配置文件中的 resolve。
          // 如果你的 webpack.config.js 导出的不是一个对象而是一个函数，
          // 你需要引入webpack.config.js，然后执行它：
          // const webpackConfig = require("./webpack.config");
          // config: webpackConfig("development")
          config: "webpack.config.js"
        }
      }
    }
  },
  {
    name: "rules",
    rules: {
      "import/extensions": [
        "error",
        "ignorePackages",
        {
          js: "never",
          jsx: "never",
          ts: "never",
          tsx: "never"
        }
      ],
      // 允许修改函数参数 draft。
      "no-param-reassign": [
        "error",
        {
          props: true,
          ignorePropertyModificationsFor: ["draft"]
        }
      ],
      // 指定命名函数组件的定义风格为箭头函数。
      "react/function-component-definition": [
        "error",
        {
          namedComponents: "arrow-function"
        }
      ],
      // 允许包含 JSX 的文件扩展名。
      "react/jsx-filename-extension": [
        "error",
        {
          extensions: ["tsx"]
        }
      ],
      // 使用 JSX 时允许缺少 React。
      "react/react-in-jsx-scope": "off",
      // 使用未使用的变量进行警告。
      "@typescript-eslint/no-unused-vars": "warn",
      "import/no-extraneous-dependencies": [
        "error",
        {
          devDependencies: ["eslint.config.mjs", "test/**/*"],
          optionalDependencies: false
        }
      ]
    }
  },
  {
    name: "overrides",
    files: ["*.js"],
    rules: {
      "@typescript-eslint/no-require-imports": "off"
    }
  }
);
