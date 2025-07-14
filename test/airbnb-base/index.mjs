import tseslint from "typescript-eslint";
import bestPractices from "./best-practices.mjs";
import errors from "./errors.mjs";
import node from "./node.mjs";
import style from "./style.mjs";
import variables from "./variables.mjs";
import es6 from "./es6.mjs";
import imports from "./imports.mjs";
import strict from "./strict.mjs";

export default tseslint.config({
  name: "eslint-config-airbnb-base",
  extends: [bestPractices, errors, node, style, variables, es6, imports, strict]
  /* parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  rules: {}, */
});
