export default {
  name: "strict",
  rules: {
    // babel inserts `'use strict';` for us
    strict: ["error", "never"]
  }
};
