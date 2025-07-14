import tseslint from "typescript-eslint";
import eslintConfigAirbnbBase from "./airbnb-base/index.mjs";
import react from "./react.mjs";
import reactA11y from "./react-a11y.mjs";

export default tseslint.config({
  name: "eslint-config-airbnb",
  extends: [eslintConfigAirbnbBase, react, reactA11y]
});
