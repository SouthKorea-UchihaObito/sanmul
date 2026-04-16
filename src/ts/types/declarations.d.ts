// CSS 파일을 모듈로 인식하도록 선언
declare module "*.css" {
  const content: { [className: string]: string };
  export default content;
}

// SCSS 파일을 모듈로 인식하도록 선언
declare module "*.scss" {
  const content: { [className: string]: string };
  export default content;
}

// 필요하다면 이미지 파일들도 미리 선언해두면 편합니다.
declare module "*.png";
declare module "*.jpg";
declare module "*.svg";
declare module "*.webp";
