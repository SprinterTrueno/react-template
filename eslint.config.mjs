import globals from "globals";
import tseslint from "typescript-eslint";
import airbnbBase from "./test/airbnb-base/index.mjs";
import react from "./test/react.mjs";
import reactA11y from "./test/react-a11y.mjs";
import reactHooks from "eslint-plugin-react-hooks";
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended";

export default tseslint.config(
  {
    languageOptions: { globals: globals.browser }
  },
  // tseslint.configs.recommended,
  airbnbBase,
  react,
  reactA11y,
  reactHooks.configs["recommended-latest"],
  tseslint.configs.strict,
  eslintPluginPrettierRecommended,
  {
    ignores: ["src/react-app-env.d.ts"]
  },
  {
    rules: {
      // 允许以下文件类型在引入的时候不加扩展名。
      /* "import/extensions": [
        "error",
        "ignorePackages",
        {
          js: "never",
          jsx: "never",
          ts: "never",
          tsx: "never"
        }
      ], */
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
      "@typescript-eslint/no-unused-vars": "warn"
    }
  },
  {
    files: ["*.js"],
    rules: {
      "@typescript-eslint/no-require-imports": "off"
    }
  }
);

// pnpm dlx eslint --inspect-config
