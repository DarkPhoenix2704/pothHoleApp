const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const resposiveLoader = require("responsive-loader/sharp");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

const isProduction = process.env.NODE_ENV === "production";

const config = {
  entry: "./src/index.tsx",
  output: {
    path: path.resolve(__dirname, "build"),
    filename: "bundle.[contenthash].js",
  },
  devServer: {
    open: true,
    port: 3000,
    hot: true,
    historyApiFallback: true,
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "src/index.html",
      minify: {
        removeAttributeQuotes: true,
        collapseWhitespace: true,
        removeComments: true,
      },
    }),
  ],
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/i,
        loader: "ts-loader",
        exclude: ["/node_modules/"],
      },
      {
        test: /\.(jpe?g|png|webp|)$/i,
        use: [
          {
            loader: "responsive-loader",
            options: {
              adapter: resposiveLoader,
              sizes: [320, 640, 960, 1200, 1800, 2400],
              placeholder: true,
              placeholderSize: 20,
            },
          },
        ],
      },
      {
        test: /\.css$/i,
        include: path.resolve(__dirname, "src"),
        use: ["style-loader", "css-loader", "postcss-loader"],
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2|gif)$/i,
        type: "asset",
      },
      {
        test: /\.js$/,
        enforce: "pre",
        use: ["source-map-loader"],
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".jsx", ".js", "..."],
  },
};

module.exports = () => {
  if (isProduction) {
    config.mode = "production";
    config.optimization = { splitChunks: { chunks: "all" } };
    config.plugins.push(new CleanWebpackPlugin());
    config.plugins.push(
      new MiniCssExtractPlugin({ filename: "bundle.[contenthash].css" })
    );
  } else {
    config.mode = "development";
  }
  return config;
};
