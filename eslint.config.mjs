import tseslint from "typescript-eslint";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended";

export default tseslint.config(
  {
    name: "languageOptions",
    languageOptions: { globals: globals.browser }
  },
  reactHooks.configs["recommended-latest"],
  tseslint.configs.strict,
  eslintPluginPrettierRecommended,
  {
    name: "ignores",
    ignores: ["src/react-app-env.d.ts"]
  },
  {
    name: "overrides",
    files: ["*.js"],
    rules: {
      "@typescript-eslint/no-require-imports": "off"
    }
  }
);
