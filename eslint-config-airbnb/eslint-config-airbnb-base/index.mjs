import bestPractices from "./best-practices.mjs";
import errors from "./errors.mjs";
import node from "./node.mjs";
import style from "./style.mjs";
import variables from "./variables.mjs";
import es6 from "./es6.mjs";
import imports from "./imports.mjs";
import strict from "./strict.mjs";

export default [
  {
    languageOptions: {
      parserOptions: {
        ecmaVersion: 2018,
        sourceType: "module"
      }
    }
  },
  bestPractices,
  errors,
  node,
  style,
  variables,
  es6,
  imports,
  strict
];
