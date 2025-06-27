module.exports = {
  install: (less, pluginManager, functions) => {
    functions.add("px2vw", (px) => {
      return `${(px.value / 1920) * 100}vw`;
    });

    functions.add("px2vh", (px) => {
      return `${(px.value / 1080) * 100}vh`;
    });
  },
};
