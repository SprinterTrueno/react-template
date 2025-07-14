import eslintConfigAirbnbBase from "./airbnb-base/index.mjs";
import react from "./react.mjs";
import reactA11y from "./react-a11y.mjs";

export default {
  name: "eslint-config-airbnb",
  extends: [eslintConfigAirbnbBase, react, reactA11y]
};
