// 通过环境变量控制是否启用px转vw
const enableVwConversion = process.env.ENABLE_VW !== "false"; // 默认启用

const px2vwPlugin = [
  "postcss-px-to-viewport-8-plugin",
  {
    // 设计稿的视窗宽度
    viewportWidth: 1920,
    // 设计稿的视窗高度（可选，一般只用宽度）
    viewportHeight: 1080,
    // 转换后的单位
    unitToConvert: "px",
    // 转换后保留的小数位数
    unitPrecision: 5,
    // 要转换的CSS属性列表，精确控制哪些属性需要转换
    propList: [
      "width",
      "height",
      "min-width",
      "max-width",
      "min-height",
      "max-height",
      "padding",
      "padding-*",
      "margin",
      "margin-*",
      "top",
      "right",
      "bottom",
      "left",
      "gap",
      "font-size" // 可选：是否转换字体大小
    ],
    // 转换后的视窗单位
    viewportUnit: "vw",
    // 字体使用的视窗单位
    fontViewportUnit: "vw",
    // 需要忽略的CSS选择器，不会转为视窗单位，使用原有的px等单位
    selectorBlackList: [
      ".ignore", // 通用忽略类
      ".hairlines", // 细线类
      ".no-convert", // 不转换类
      ".fixed-size", // 固定尺寸类
      /^\.ant-/ // 忽略所有antd组件（正则表达式）
    ],
    // 小于或等于该值的px不转换为视窗单位
    minPixelValue: 1,
    // 是否允许在媒体查询中转换px
    mediaQuery: false,
    // 是否转换px，false则不转换
    replace: true,
    // 处理所有文件，但排除指定的文件/目录
    exclude: [/node_modules/],
    // include: undefined, // 不设置include，处理所有文件（除了exclude的）
    // 是否处理横屏情况
    landscape: false,
    // 横屏时使用的单位
    landscapeUnit: "vw",
    // 横屏时使用的视窗宽度
    landscapeWidth: 1920
  }
];

module.exports = {
  plugins: enableVwConversion ? [px2vwPlugin] : []
};
