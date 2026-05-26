const path = require("path");
const { IgnorePlugin, DefinePlugin } = require("webpack");
const dotenv = require("dotenv");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CaseSensitivePathsPlugin = require("case-sensitive-paths-webpack-plugin");
const ReactRefreshWebpackPlugin = require("@pmmmwh/react-refresh-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");

const { NODE_ENV } = process.env;

// 读取对应环境的 .env 文件
const envFile = dotenv.config({ path: `.env.${NODE_ENV}` }).parsed || {};

const DEVELOPMENT_ENV = NODE_ENV === "development";
const PRODUCTION_ENV = NODE_ENV === "production";
const PORT = 8080;

// 将 REACT_APP_ 开头的环境变量注入到代码中
const envDefines = Object.fromEntries(
  Object.entries(envFile)
    .filter(([key]) => key.startsWith("REACT_APP_"))
    .map(([key, value]) => [`process.env.${key}`, JSON.stringify(value)])
);

module.exports = {
  mode: NODE_ENV,
  entry: path.resolve(__dirname, "src/index.tsx"),
  output: {
    clean: true,
    filename: "[name].[contenthash:8].js",
    path: path.resolve(__dirname, "dist")
  },
  module: {
    rules: [
      {
        oneOf: [
          {
            test: /\.[jt]sx?$/i,
            loader: "babel-loader",
            include: /src/,
            options: {
              presets: [
                "@babel/preset-env",
                ["@babel/preset-react", { runtime: "automatic" }],
                "@babel/preset-typescript"
              ],
              plugins: [
                "babel-plugin-react-compiler",
                DEVELOPMENT_ENV && require.resolve("react-refresh/babel")
              ].filter(Boolean)
            }
          },
          {
            test: /\.css$/i,
            use: [
              DEVELOPMENT_ENV ? "style-loader" : MiniCssExtractPlugin.loader,
              {
                loader: "css-loader",
                options: {
                  modules: {
                    auto: true,
                    localIdentName: "[local]__[hash:base64:5]",
                    namedExport: false
                  }
                }
              },
              {
                loader: "postcss-loader"
              }
            ]
          },
          {
            test: /\.less$/i,
            use: [
              DEVELOPMENT_ENV ? "style-loader" : MiniCssExtractPlugin.loader,
              {
                loader: "css-loader",
                options: {
                  modules: {
                    auto: true,
                    localIdentName: "[local]__[hash:base64:5]",
                    namedExport: false
                  }
                }
              },
              {
                loader: "postcss-loader"
              },
              {
                loader: "less-loader"
              }
            ]
          },
          {
            test: /\.(jpe?g|png|gif|svg|bpm)$/i,
            type: "asset"
          }
        ]
      }
    ]
  },
  resolve: {
    alias: { "@": path.resolve(__dirname, "src") },
    // webpack 会尝试按顺序解析，所以应该尽可能减少匹配次数，以提高性能。
    extensions: [".js", ".ts", ".tsx", ".jsx"]
  },
  devtool: DEVELOPMENT_ENV ? "eval-cheap-module-source-map" : false,
  cache: { type: "filesystem" },
  devServer: {
    client: { overlay: false },
    historyApiFallback: true,
    port: PORT,
    static: false
  },
  plugins: [
    new DefinePlugin(envDefines),
    new IgnorePlugin({
      resourceRegExp: /^\.\/locale$/,
      contextRegExp: /dayjs$/
    }),
    new HtmlWebpackPlugin({
      template: "public/index.html",
      minify: PRODUCTION_ENV
        ? {
            removeComments: true,
            collapseWhitespace: true,
            removeRedundantAttributes: true,
            useShortDoctype: true,
            removeEmptyAttributes: true,
            removeStyleLinkTypeAttributes: true,
            keepClosingSlash: true,
            minifyJS: true,
            minifyCSS: true,
            minifyURLs: true
          }
        : false
    }),
    DEVELOPMENT_ENV && new CaseSensitivePathsPlugin(),
    DEVELOPMENT_ENV && new ReactRefreshWebpackPlugin({ overlay: false }),
    PRODUCTION_ENV &&
      new MiniCssExtractPlugin({
        filename: "[name].[contenthash:8].css"
      })
  ].filter(Boolean),
  optimization: {
    minimizer: [new CssMinimizerPlugin(), new TerserPlugin()],
    splitChunks: {
      chunks: "all",
      cacheGroups: {
        react: {
          test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
          name: "react-vendor",
          chunks: "all"
        },
        "react-router": {
          test: /[\\/]node_modules[\\/](react-router)[\\/]/,
          name: "react-router-vendor",
          chunks: "all"
        },
        antd: {
          test: /[\\/]node_modules[\\/](.pnpm[\\/].*)?[\\/]?(antd|@ant-design|rc-.+)[\\/]/,
          name: "antd-vendor",
          chunks: "all"
        },
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          name: "vendors",
          chunks: "all"
        }
      }
    }
  }
};
