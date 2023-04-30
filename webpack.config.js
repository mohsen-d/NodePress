const HtmlPlugin = require("html-webpack-plugin");
const FileManagerPlugin = require("filemanager-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const path = require("path");

const clientSrcPath = path.resolve(__dirname, "./client/src/index.js");
const clientDistPath = path.resolve(__dirname, "./client/dist");
const serverTemplatePath = path.resolve(
  __dirname,
  "./server/templates/default"
);
const htmlTemplatePath = path.resolve(__dirname, "./client/src/index.ejs");

module.exports = {
  entry: {
    main: clientSrcPath,
  },
  output: {
    filename: "bundle.js",
    path: clientDistPath,
  },
  devServer: {
    static: clientDistPath,
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: "/node_modules/",
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env", "@babel/preset-react"],
          },
        },
      },
      {
        test: /\.css$/i,
        use: [
          MiniCssExtractPlugin.loader,
          { loader: "css-loader", options: { modules: true } },
        ],
      },
    ],
  },
  plugins: [
    new HtmlPlugin({
      filename: "index.ejs",
      template: htmlTemplatePath,
      templateParameters: { content: "<%= content %>" },
    }),
    new MiniCssExtractPlugin({ filename: "styles.css" }),
    new FileManagerPlugin({
      events: {
        onEnd: {
          copy: [{ source: clientDistPath, destination: serverTemplatePath }],
        },
      },
    }),
  ],
};
