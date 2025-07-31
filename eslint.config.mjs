import tseslint from "typescript-eslint";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended";
import eslintConfigAirbnb from "./eslint-config-airbnb/index.mjs";
import importsRules from "./eslint-config-airbnb/eslint-config-airbnb-base/imports.mjs";

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
      // 允许修改函数参数 draft。
      "no-param-reassign": [
        "error",
        {
          props: true,
          ignorePropertyModificationsFor: ["draft"]
        }
      ],
      // 允许下列文件使用 devDependencies。
      "import/no-extraneous-dependencies": [
        "error",
        {
          devDependencies: [
            ...importsRules.rules["import/no-extraneous-dependencies"][1]
              .devDependencies,
            "eslint.config.mjs",
            "eslint-config-airbnb/**"
          ],
          optionalDependencies: false
        }
      ],
      // 忽略 tsx 文件的扩展名。
      "import/extensions": [
        "error",
        "ignorePackages",
        {
          ...importsRules.rules["import/extensions"][2],
          ts: "never",
          tsx: "never"
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
          extensions: [".tsx"]
        }
      ],
      // 使用 JSX 时允许缺少 React。
      "react/react-in-jsx-scope": "off",
      // 使用未使用的变量进行警告。
      "@typescript-eslint/no-unused-vars": "warn"
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
