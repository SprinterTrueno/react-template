import globals from "globals";

export default {
  /* env: {
    node: true
  }, */
  name: "node",
  languageOptions: { globals: globals.node },
  rules: {
    // enforces error handling in callbacks (node environment)
    "handle-callback-err": "off",

    // disallow mixing regular variable and require declarations
    "no-mixed-requires": ["off", false],

    // disallow use of process.env
    "no-process-env": "off",

    // disallow process.exit()
    "no-process-exit": "off",

    // restrict usage of specified node modules
    "no-restricted-modules": "off",

    // disallow use of synchronous methods (off by default)
    "no-sync": "off"
  }
};
