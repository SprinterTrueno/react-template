import eslintConfigAirbnbBase from "./eslint-config-airbnb-base/index.mjs";
import react from "./react.mjs";
import reactA11y from "./react-a11y.mjs";

export default {
  extends: [eslintConfigAirbnbBase, react, reactA11y]
};
