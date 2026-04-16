import path from "path";
import { fileURLToPath } from "url";
import { merge } from "webpack-merge";
import webpackCommon from "./webpack.common.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default merge(webpackCommon, {
  mode: "development",
  // 에러가 났을 때 원래 TS 소스 코드 위치를 정확히 짚어줍니다.
  devtool: "inline-source-map",
  devServer: {
    static: {
      // 빌드된 결과물이 있는 곳을 브라우저에 띄웁니다.
      directory: path.join(__dirname, "dist"),
    },
    compress: true,
    port: 3000,
    open: true,
    hot: true, // 수정 시 전체 새로고침 없이 바뀐 부분만 반영
    historyApiFallback: true, // 서브 페이지 경로 인식 해결
  },
});
