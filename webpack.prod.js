import path from "path";
import { fileURLToPath } from "url";
import { merge } from "webpack-merge";
import webpackCommon from "./webpack.common.js";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import TerserPlugin from "terser-webpack-plugin";
import CssMinimizerPlugin from "css-minimizer-webpack-plugin";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default merge(webpackCommon, {
  mode: "production",
  devtool: false,
  output: {
    filename: "./js/[name].[contenthash].js",
    chunkFilename: "js/[name].[contenthash:8].chunk.js",
    assetModuleFilename: "./js/[name].[contenthash][ext]",
    publicPath: "/",
    clean: true,
  },
  plugins: [
    // common에 있는 설정을 배포용 해시 파일명으로 덮어씁니다.
    new MiniCssExtractPlugin({
      filename: "css/[name].[contenthash:8].css",
    }),
  ],
  // 배포용 최적화 설정 (압축)
  optimization: {
    minimizer: [
      new TerserPlugin(), // 자바스크립트 압축
      new CssMinimizerPlugin(), // CSS 압축
    ],
  },
});
