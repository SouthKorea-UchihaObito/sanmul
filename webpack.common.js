import path from "path";
import { fileURLToPath } from "url";
import HtmlWebpackPlugin from "html-webpack-plugin";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import { CleanWebpackPlugin } from "clean-webpack-plugin";
import CopyPlugin from "copy-webpack-plugin";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default {
  entry: {
    // index: "./src/js/index.js", // index 속성 생성
    index: path.join(__dirname, "src", "ts", "index.ts"),
    // 여러개를 작성 할 경우
    storyBrand: path.join(__dirname, "src", "ts", "storyBrand.ts"),
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "./js/[name].[contenthash:8].js",
    publicPath: "/",
    clean: true,
  },
  // 2. 확장자 생략 설정을 추가 (중요!)
  resolve: {
    extensions: [".ts", ".js", ".json"],
    alias: {
      // '@' 기호를 src 폴더의 절대 경로로 지정합니다.
      "@": path.resolve(__dirname, "src"),
      // 자주 쓰는 폴더는 따로 지정하면 더 편해요.
      "@css": path.resolve(__dirname, "src", "css"),
      "@ts": path.resolve(__dirname, "src", "ts"),
      "@images": path.resolve(__dirname, "src", "images"),
    },
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/index.html", // 번들링 되기전 html (우리가 웹팩에 번들링 하기 전 작성할 html)
      filename: "./index.html", // 번들링 후 html
      hash: false, // 모든 스크립트, css 캐시 무효화 해줌 ([contenthash:8] 설정함)
      showErrors: true, // html에 오류 출력 해줌
      /*
          index.html에서 index.js를 불러오라는 명령어가 없음
          2개가 한번에 다 불러와짐
  
          구분할 용도로 chunks가 필요함 배열로 들어감
        */
      chunks: ["index"],
    }),
    // 하나 더 만들어보자
    new HtmlWebpackPlugin({
      template: "./src/template/storyBrand.html", // 번들링 되기전 html (우리가 웹팩에 번들링 하기 전 작성할 html)
      filename: "./template/storyBrand.html", // 번들링 후 html
      hash: false, // 모든 스크립트, css 캐시 무효화 해줌
      showErrors: true, // html에 오류 출력 해줌
      chunks: ["storyBrand"],
    }),
    new MiniCssExtractPlugin({
      filename: "./css/[name].[contenthash:8].css", // 번들 후 css 파일명
    }),
    new CopyPlugin({
      patterns: [
        {
          // 원본 폴더: src 폴더 안의 images 폴더를 통째로 지정
          from: path.resolve(__dirname, "src/images"),
          // 대상 폴더: dist 폴더 안의 images 폴더로 복사 (output.path 기준)
          to: "images",
          // (선택) 만약 특정 파일만 제외하고 싶다면 globOptions를 쓰지만,
          // 지금은 다 필요하므로 생략합니다.
        },
      ],
    }),
  ],
  module: {
    rules: [
      {
        test: /\.(ts|js)$/, // .ts와 .js 모두 처리
        exclude: /node_modules/,
        use: [
          // 2. 바벨이 최종적으로 구형 브라우저 호환성을 맞춤
          {
            loader: "babel-loader",
            options: {
              presets: [
                [
                  "@babel/preset-env",
                  {
                    targets: "defaults", // 전 세계적으로 가장 많이 쓰이는 브라우저들(시장 점유율 상위권)을 타겟
                    useBuiltIns: "usage", // 내가 쓴 코드 중에서, 브라우저가 지원하지 않는 것만 골라서 폴리필을 추가
                    corejs: 3, // 폴리필 코드의 원천인 core-js라는 라이브러리의 버전 3을 사용
                  },
                ],
              ],
            },
          },
          // 1. 타입스크립트 로더가 먼저 TS를 JS로 변환함
          {
            loader: "ts-loader",
            options: {
              // 바벨이 변환을 담당하므로 ts-loader는 타입 검사와 최신 문법 변환에 집중
              transpileOnly: true,
            },
          },
        ],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif|webp)$/i,
        type: "asset/resource", // 파일을 dist로 복사하고 경로를 반환함
        generator: {
          filename: "images/[path][name].[contenthash][ext]", // dist/images 폴더에 원본이름 그대로 저장
        },
      },
      // ts 파일용
      {
        test: /\.ts$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
      // 1. css 파일용
      {
        test: /\.css$/i,
        use: [MiniCssExtractPlugin.loader, "css-loader"],
        exclude: /node_modules/,
      },
      // 2. Sass 파일용
      {
        test: /\.s[ac]ss$/i,
        use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"],
        exclude: /node_modules/,
      },
    ],
  },
};
