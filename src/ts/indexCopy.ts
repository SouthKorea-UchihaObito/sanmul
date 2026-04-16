import "@css/reset.css";
import "@css/global.css";
import "@css/style.css";

import { AnimValue, SceneInfo } from "./types/scene";

let yScroll: number = 0; // window.scrollY 대신 사용 할 변수
let prevScrollHeight: number = 0; // 현재 스크롤 위치(yScroll)보다 이전에 위치한 스크롤 섹션들의 스크롤 높이값의 합
let currentScene: number = 0; // 현재 활성화된 씬
let enterNewScene: boolean = false; // true/false 유무에 따라서 새로운 씬에 들어갔다고 판단

let acc: number = 0.1; // 가속도 역할
let delaydscrollY: number = 0; //
let rafId: number = 0; // requestAnimationFrame 반환 값 담을 변수
let rafState: boolean = false; // requestAnimationFrame 상태 관리 변수

// 객체 안에서 null 일 수도 있으니까 미리 변수로 선언해서 null 체크 하기 용이하게 선언
const videoCanvas = document.querySelector<HTMLCanvasElement>("#videoCanvas0");
// 이 폴더 안의 JPG 파일들을 모두 Webpack 모듈로 등록
const videoImageContext = require.context("@/images/video", false, /\.webp$/);

const imageCanvas =
  document.querySelector<HTMLCanvasElement>(".imageBlendCanvas");

// 이 폴더 안의 JPG 파일들을 모두 Webpack 모듈로 등록
const imageContext = require.context(
  "../images/canvasScale",
  false,
  /\.webp$/i,
);

// const imageContext = require.context("../images/", false, /\.JPG$/i);

const sceneInfo: SceneInfo[] = [
  {
    // 0
    type: "sticky",
    heightNum: 5, // 브라우저 높이 기준 5배로 scrollHeight 세팅
    scrollHeight: 0, // 어떤 기기에서 웹페이지를 오픈할지 모르기 때문에 0으로 세팅
    objs: {
      container: document.querySelector<HTMLElement>("#scrollSection0"),
      messageA: document.querySelector<HTMLDivElement>(
        "#scrollSection0 .mainMessageA",
      ),
      messageB: document.querySelector<HTMLDivElement>(
        "#scrollSection0 .mainMessageB",
      ),
      senmulLogo: document.querySelector<HTMLObjectElement>(
        "#scrollSection0 .senmulLogo",
      ),
      pathElem: document.querySelector<SVGPathElement>(
        "#scrollSection0 .bluePath svg .blueBoxPath",
      ),
    },
    values: {
      messageA: {
        opacityIn: [0, 1, { start: 0.15, end: 0.2 }],
        opacityOut: [1, 0, { start: 0.25, end: 0.3 }],
        translateYin: [20, 0, { start: 0.15, end: 0.2 }],
        translateYout: [0, -20, { start: 0.25, end: 0.3 }],
      },
      messageB: {
        opacityIn: [0, 1, { start: 0.35, end: 0.45 }],
        opacityOut: [1, 0, { start: 0.5, end: 0.55 }],
      },
      senmulLogoValue: {
        senmulLogoWidthIn: [1000, 200, { start: 0.15, end: 0.4 }],
        senmulLogoWidthOut: [200, 50, { start: 0.4, end: 0.7 }],
        senmulLogoTransfromXin: [-10, -20, { start: 0.2, end: 0.4 }],
        senmulLogoTransfromXout: [-20, -50, { start: 0.4, end: 0.7 }],
        senmulLogoOpacityOut: [1, 0, { start: 0.7, end: 0.8 }],
      },
      pathElem: {
        pathDashoffsetIn: [2008, 0, { start: 0.2, end: 0.4 }],
        pathDashoffsetOut: [0, 2008, { start: 0.6, end: 0.8 }],
      },
    },
  },
  {
    // 1
    type: "sticky",
    heightNum: 5, // 브라우저 높이 기준 5배로 scrollHeight 세팅
    scrollHeight: 0, // 어떤 기기에서 웹페이지를 오픈할지 모르기 때문에 0으로 세팅
    objs: {
      container: document.querySelector<HTMLElement>("#scrollSection1"),
      wrapper: document.querySelector<HTMLElement>(".senmulContentWrapper"),
    },
    values: {
      traX: [0, 0, { start: 0.05, end: 0.65 }],
    },
  },
  {
    // 2
    type: "normal",
    // heightNum: 0, // 브라우저 높이 기준 5배로 scrollHeight 세팅
    scrollHeight: 0, // 어떤 기기에서 웹페이지를 오픈할지 모르기 때문에 0으로 세팅
    objs: {
      container: document.querySelector<HTMLElement>("#scrollSection2"),
    },
  },
  {
    // 3
    type: "sticky",
    heightNum: 5, // 브라우저 높이 기준 5배로 scrollHeight 세팅
    scrollHeight: 0, // 어떤 기기에서 웹페이지를 오픈할지 모르기 때문에 0으로 세팅
    objs: {
      container: document.querySelector<HTMLElement>("#scrollSection3"),
      messageA: document.querySelector<HTMLDivElement>(
        "#scrollSection3 .descMessageA",
      ),
      messageB: document.querySelector<HTMLDivElement>(
        "#scrollSection3 .descMessageB",
      ),
      messageC: document.querySelector<HTMLDivElement>(
        "#scrollSection3 .descMessageC",
      ),
      messageD: document.querySelector<HTMLDivElement>(
        "#scrollSection3 .descMessageD",
      ),

      pinB: document.querySelector<HTMLDivElement>(
        "#scrollSection3 .descMessageB .pin",
      ),
      pinC: document.querySelector<HTMLDivElement>(
        "#scrollSection3 .descMessageC .pin",
      ),
      pinD: document.querySelector<HTMLDivElement>(
        "#scrollSection3 .descMessageD .pin",
      ),
      canvas: videoCanvas,
      get context() {
        return this.canvas ? this.canvas.getContext("2d") : null;
      },
      videoImages: [],
    },
    values: {
      videoImageCount: 600,
      imageSequenc: [0, 599],
      canvasOpacityIn: [0, 1, { start: 0, end: 0.1 }],
      canvasOpacityOut: [1, 0, { start: 0.85, end: 1 }],
      messageA: {
        opacityIn: [0, 1, { start: 0.1, end: 0.2 }],
        opacityOut: [1, 0, { start: 0.25, end: 0.3 }],
        translateYin: [20, 0, { start: 0.1, end: 0.2 }],
        translateYout: [0, -20, { start: 0.25, end: 0.3 }],
      },
      messageB: {
        opacityIn: [0, 1, { start: 0.3, end: 0.4 }],
        opacityOut: [1, 0, { start: 0.45, end: 0.5 }],
        translateYin: [30, 0, { start: 0.3, end: 0.4 }],
        translateYout: [0, -20, { start: 0.45, end: 0.5 }],
      },
      messageC: {
        opacityIn: [0, 1, { start: 0.5, end: 0.6 }],
        opacityOut: [1, 0, { start: 0.65, end: 0.7 }],
        translateYin: [30, 0, { start: 0.5, end: 0.6 }],
        translateYout: [0, -20, { start: 0.65, end: 0.7 }],
      },
      messageD: {
        opacityIn: [0, 1, { start: 0.7, end: 0.8 }],
        opacityOut: [1, 0, { start: 0.85, end: 0.9 }],
        translateYin: [30, 0, { start: 0.7, end: 0.8 }],
        translateYout: [0, -20, { start: 0.85, end: 0.9 }],
      },
      pinB: {
        scaleY: [0.5, 1, { start: 0.3, end: 0.4 }],
        opacityIn: [0, 1, { start: 0.5, end: 0.55 }],
        opacityOut: [1, 0, { start: 0.5, end: 0.55 }],
      },
      pinC: {
        scaleY: [0.5, 1, { start: 0.5, end: 0.6 }],
        opacityIn: [0, 1, { start: 0.6, end: 0.7 }],
        opacityOut: [1, 0, { start: 0.75, end: 0.8 }],
      },
      pinD: {
        scaleY: [0.5, 1, { start: 0.7, end: 0.8 }],
        opacityIn: [0, 1, { start: 0.72, end: 0.77 }],
        opacityOut: [1, 0, { start: 0.85, end: 0.9 }],
      },
    },
  },
  {
    // 4
    type: "sticky",
    heightNum: 5, // 브라우저 높이 기준 5배로 scrollHeight 세팅
    scrollHeight: 0, // 어떤 기기에서 웹페이지를 오픈할지 모르기 때문에 0으로 세팅
    objs: {
      container: document.querySelector<HTMLElement>("#scrollSection4"),
      canvasCaption: document.querySelector<HTMLElement>(".canvasCaption"),
      canvas: imageCanvas,
      get context() {
        return this.canvas ? this.canvas.getContext("2d") : null;
      },
      imagesPath: [
        "./images/canvasScale/1.webp",
        "./images/canvasScale/2.webp",
      ],
      images: [],
    },
    values: {
      // 미리 정하지 않은 이유는 화면 크기가 어떨지 몰라서
      rect1X: [0, 0, { start: 0, end: 0 }],
      rect2X: [0, 0, { start: 0, end: 0 }],
      imageBlendHeight: [0, 0, { start: 0, end: 0 }],
      canvasScale: [0, 0, { start: 0, end: 0 }],
      rectStartY: 0,
      textOpacity: [0, 1, { start: 0, end: 0 }],
      canvasCaptionOpacity: [0, 1, { start: 0, end: 0 }],
      canvasCaptionTranslateY: [20, 0, { start: 0, end: 0 }],
    },
  },
];

const setCanvasImages = () => {
  // canvas에 그려서 처리할 이미지들을 여기서 세팅해주기
  let imageElem: HTMLImageElement | null;
  const sceneInfo3 = sceneInfo[3].values;
  if (sceneInfo[3].objs.videoImages && sceneInfo3) {
    const { videoImageCount } = sceneInfo3;
    const keys001 = videoImageContext.keys().sort((a, b) => {
      return (
        parseInt(a.replace(/[^0-9]/g, "")) - parseInt(b.replace(/[^0-9]/g, ""))
      );
    });

    keys001.forEach((key, index) => {
      const img = new Image();
      img.src = videoImageContext(key);
      if (sceneInfo[3].objs.videoImages) {
        sceneInfo[3].objs.videoImages.push(img);
      }
    });

    // if (typeof videoImageCount === "number") {
    //   for (let i = 0; i < videoImageCount; i++) {
    //     imageElem = new Image();
    //     imageElem.src = `./images/video/${i + 1}.webp`;
    //     sceneInfo[3].objs.videoImages.push(imageElem);
    //   }
    // }
  }

  const keys002 = imageContext.keys().sort();
  keys002.forEach((key, index) => {
    const img = new Image();
    img.src = imageContext(key);
    if (sceneInfo[4].objs.images) {
      sceneInfo[4].objs.images.push(img);
    }
  });

  // if (sceneInfo[4].objs.imagesPath && sceneInfo[4].objs.images) {
  //   for (let i = 0; i < sceneInfo[4].objs.imagesPath.length; i++) {
  //     imageElem2 = new Image();
  //     imageElem2.src = sceneInfo[4].objs.imagesPath[i];
  //     sceneInfo[4].objs.images.push(imageElem2);
  //   }
  // }
};

const setLayout = () => {
  // 각 스크롤 섹션의 높이를 세팅해주는 함수
  for (let i = 0; i < sceneInfo.length; i++) {
    let container = sceneInfo[i].objs.container;
    let heightNum = sceneInfo[i].heightNum;
    if (sceneInfo[i].type === "sticky") {
      if (heightNum) {
        sceneInfo[i].scrollHeight = heightNum * window.innerHeight;
      }

      if (i === 1) {
        const wrapper = sceneInfo[i].objs.wrapper;
        if (wrapper) {
          const horLength = wrapper.scrollWidth - window.innerWidth;

          sceneInfo[i].scrollHeight = (horLength + window.innerHeight) * 1.2;
        }
      }
    } else if (sceneInfo[i].type === "normal") {
      if (container) {
        // offsetHeight = 객체의 일반 높이
        sceneInfo[i].scrollHeight = container.offsetHeight;
      }
    }
    if (container) {
      container.style.height = `${sceneInfo[i].scrollHeight}px`;
    }
  }

  yScroll = window.scrollY;
  // currentScene 세팅해주기

  /*
    현재 스크롤 위치에 맞춰서 currentScene을 세팅해줘야함
    setLayout 에서도 currentScene을 자동으로 세팅하는 기능 도와줄 변수
  */
  let totalScrollHeight: number = 0;
  for (let i = 0; i < sceneInfo.length; i++) {
    totalScrollHeight += sceneInfo[i].scrollHeight;
    // 현재 스크롤 위치와 비교하기
    /*
      첫 번째 것부터 네 번째 것까지 비교함 totalScrollHeight는 점점 높아짐
      sceneInfo의 스크롤 높이값을 더 했기 때문에
      for문이 돌면 돌수록... 그러다가 어느 순간에 이걸 멈춰줘야함
    */

    // if (totalScrollHeight >= yScroll) {
    //   console.log(totalScrollHeight);
    //   currentScene = i;
    //   console.log(currentScene);
    //   break;
    // }

    if (totalScrollHeight > yScroll) {
      currentScene = i;

      break;
    }
  }
  // 만약 스크롤이 가장 마지막까지 내려가서 위의 루프를 다 통과해버린 경우

  if (yScroll >= totalScrollHeight - window.innerHeight) {
    currentScene = sceneInfo.length - 1;
  }

  document.body.setAttribute("id", `showScene${currentScene}`);

  // 새로고침 시 애니메이션 값이 튀지 않도록 지연 스크롤 값도 동기화
  delaydscrollY = yScroll;

  if (sceneInfo[3].objs.canvas) {
    const widthRatio = window.innerWidth / 1920;
    const heightRatio = window.innerHeight / 1080;

    const maxRatio = Math.max(widthRatio, heightRatio);
    // 화면 사이즈가 높이에 맞춰서 canvas높이가 맞춰짐
    sceneInfo[3].objs.canvas.style.transform = `translate3d(-50%, -50%, 0) scale(${maxRatio})`;
  }
};

const calcValues = (values: AnimValue, currentYscroll: number): number => {
  /*
  values 매개변수의 역할

  sceneInfo values의 messageAopacity: [0, 1] 원소 2개
  이 값 변화의 시작값과 끝값 그 배열이라고 보면 된다.

  values의 0, 1 각 값에 접근을 하면 된다.

  ----------------------------------------------------

  currentYscroll 매개변수의 역할

  현재 씬에서 얼마나 스크롤 됐는지를 판단함(전체 스크롤 판단은 yScroll)
  */

  let returnValue: number = 0;

  /*
    현재 씬에서 스크롤된 범위를 비율로 구하기

    스크롤 안했으면 0 전부 스크롤 했으면
    1이라고 하면 절반 스크롤 했을 때 0.5 이런 식

    scrollRatio 라는 변수에 저장
  */

  /* scrollHeight - 현재 씬의 scrollHeight 값 */
  const scrollHeight: number = sceneInfo[currentScene].scrollHeight;

  /* scrollRatio - 현재 씬에서 스크롤된 범위를 비율로 구한 값 */
  const scrollRatio: number = currentYscroll / scrollHeight;

  if (values.length === 3) {
    // start / end 사이에 애니메이션 실행

    // 시작점 구하기
    const partScrollStart: number = values[2].start * scrollHeight;

    // 끝점 구하기
    const partScrollEnd: number = values[2].end * scrollHeight;

    // Start 와 End 의 scrollHeight 구하기
    const partScrollHeight: number = partScrollEnd - partScrollStart;

    // partScrollStart ~ partScrollEnd 사이에 들어왔을 때
    if (currentYscroll >= partScrollStart && currentYscroll <= partScrollEnd) {
      // 부분 스크롤 영역의 비율이 반영돼야함!
      returnValue =
        ((currentYscroll - partScrollStart) / partScrollHeight) *
          (values[1] - values[0]) +
        values[0];
    } else if (currentYscroll < partScrollStart) {
      // 현재 씬의 스크롤된 값이 start 구간보다 작으면 초기값 0 (opacity 0)
      returnValue = values[0];
    } else if (currentYscroll > partScrollEnd) {
      // 현재 씬의 스크롤된 값이 end 구간보다 크면 최종값 1 (opacity 1)
      returnValue = values[1];
    }
  } else {
    /*
      !!! 현재 씬의 전체 범위에서
    
      아래 계산식의 경우에는 구체적인 구간이 설정된 게 아니라
      현재 씬에 처음부터 끝까지 재생되는 경우에 값 계산을 하는 것임
      이제 분기 처리를 해줘야함

      start / end 시점이 구체적으로 명시된 애들은
      그 타이밍으로 값이 계산돼서 적용될 수 있도록
    */
    returnValue = scrollRatio * (values[1] - values[0]) + values[0];
  }

  return returnValue;
};

const playAnimation = () => {
  const values = sceneInfo[currentScene].values || {};
  const objs = sceneInfo[currentScene].objs || {};

  const currentYscroll: number = yScroll - prevScrollHeight;
  const scrollHeight: number = sceneInfo[currentScene].scrollHeight;
  // 현재 씬에서 얼마만큼 스클롤을 했는지 비율이 나옴
  const scrollRatio: number = currentYscroll / scrollHeight;

  /*
    축약어

    mes = message
  */

  const {
    messageA: mesA,
    messageB: mesB,
    messageC: mesC,
    messageD: mesD,
    traX,
    senmulLogoValue,
    pathElem,
    pinB,
    pinC,
    pinD,
    canvasOpacityIn,
    canvasOpacityOut,
    textOpacity,
  } = values;

  switch (currentScene) {
    case 0:
      // console.log("0 play");

      /*
          스크롤 비율에 따라서 In / Out 적용할 것인지 분기 처리
        */
      //  messageA
      if (
        objs.messageA &&
        mesA &&
        mesA.opacityIn &&
        mesA.opacityOut &&
        mesA.translateYin &&
        mesA.translateYout
      ) {
        if (scrollRatio <= 0.22) {
          // In
          objs.messageA.style.opacity = String(
            calcValues(mesA.opacityIn, currentYscroll),
          );
          objs.messageA.style.transform = `translate3d(0,${calcValues(
            mesA.translateYin,
            currentYscroll,
          )}%, 0)`;
        } else {
          // Out
          objs.messageA.style.opacity = String(
            calcValues(mesA.opacityOut, currentYscroll),
          );
          objs.messageA.style.transform = `translate3d(0, ${calcValues(
            mesA.translateYout,
            currentYscroll,
          )}%, 0)`;
        }
      }

      // messageB
      if (objs.messageB && mesB && mesB.opacityIn && mesB.opacityOut) {
        if (scrollRatio <= 0.48) {
          objs.messageB.style.opacity = String(
            calcValues(mesB.opacityIn, currentYscroll),
          );
        } else {
          objs.messageB.style.opacity = String(
            calcValues(mesB.opacityOut, currentYscroll),
          );
        }
      }

      // senmulLogo
      if (
        objs.senmulLogo &&
        senmulLogoValue &&
        senmulLogoValue.senmulLogoWidthIn &&
        senmulLogoValue.senmulLogoWidthOut &&
        senmulLogoValue.senmulLogoTransfromXin &&
        senmulLogoValue.senmulLogoTransfromXout
      ) {
        if (scrollRatio <= 0.4) {
          objs.senmulLogo.style.width = `${calcValues(senmulLogoValue.senmulLogoWidthIn, currentYscroll)}vw`;
          objs.senmulLogo.style.transform = `translate(${calcValues(senmulLogoValue.senmulLogoTransfromXin, currentYscroll)}%, -50%)`;
        } else {
          objs.senmulLogo.style.width = `${calcValues(senmulLogoValue.senmulLogoWidthOut, currentYscroll)}vw`;
          objs.senmulLogo.style.transform = `translate(${calcValues(senmulLogoValue.senmulLogoTransfromXout, currentYscroll)}%, -50%)`;
        }
      }

      // stroke
      if (
        objs.pathElem &&
        pathElem &&
        pathElem.pathDashoffsetIn &&
        pathElem.pathDashoffsetOut
      ) {
        if (scrollRatio <= 0.5) {
          objs.pathElem.style.strokeDashoffset = String(
            calcValues(pathElem.pathDashoffsetIn, currentYscroll),
          );
        } else {
          objs.pathElem.style.strokeDashoffset = String(
            calcValues(pathElem.pathDashoffsetOut, currentYscroll),
          );
        }
      }

      if (
        objs.senmulLogo &&
        senmulLogoValue &&
        senmulLogoValue.senmulLogoOpacityOut
      ) {
        objs.senmulLogo.style.opacity = String(
          calcValues(senmulLogoValue.senmulLogoOpacityOut, currentYscroll),
        );
      }

      break;
    case 1:
      // console.log("1 play");

      if (objs && objs.wrapper) {
        const horLength = objs.wrapper.scrollWidth - window.innerWidth;
        if (traX) {
          traX[1] = -horLength * 1.1;
          objs.wrapper.style.transform = `translate3d(${calcValues(traX, currentYscroll)}px, 0,  0)`;
        }
      }

      break;
    case 2:
      // console.log("2 play");

      break;
    case 3:
      // console.log("3 play");
      // let sequence = Math.round(
      //   calcValues(values.imageSequenc, currentYscroll),
      // );
      // if (objs.context && objs.videoImages) {
      //   objs.context.drawImage(objs.videoImages[sequence], 0, 0);
      // }
      if (objs.canvas && canvasOpacityIn && canvasOpacityOut) {
        if (scrollRatio <= 0.5) {
          objs.canvas.style.opacity = String(
            calcValues(canvasOpacityIn, currentYscroll),
          );
        } else {
          objs.canvas.style.opacity = String(
            calcValues(canvasOpacityOut, currentYscroll),
          );
        }
      }

      if (
        objs.messageA &&
        mesA &&
        mesA.opacityIn &&
        mesA.opacityOut &&
        mesA.translateYin &&
        mesA.translateYout
      ) {
        if (scrollRatio <= 0.22) {
          // In
          objs.messageA.style.opacity = String(
            calcValues(mesA.opacityIn, currentYscroll),
          );
          objs.messageA.style.transform = `translate3d(0, ${calcValues(mesA.translateYin, currentYscroll)}%, 0)`;
        } else {
          // Out
          objs.messageA.style.opacity = String(
            calcValues(mesA.opacityOut, currentYscroll),
          );
          objs.messageA.style.transform = `translate3d(0, ${calcValues(mesA.translateYout, currentYscroll)}%, 0)`;
        }
      }
      if (
        objs.messageB &&
        mesB &&
        mesB.opacityIn &&
        mesB.opacityOut &&
        mesB.translateYin &&
        mesB.translateYout &&
        pinB
      ) {
        if (scrollRatio <= 0.42) {
          // In
          objs.messageB.style.opacity = String(
            calcValues(mesB.opacityIn, currentYscroll),
          );
          objs.messageB.style.transform = `translate3d(0, ${calcValues(
            mesB.translateYin,
            currentYscroll,
          )}%, 0)`;

          if (objs.pinB && pinB.scaleY) {
            objs.pinB.style.transform = `scaleY(${calcValues(pinB.scaleY, currentYscroll)})`;
          }
        } else {
          // Out
          objs.messageB.style.opacity = String(
            calcValues(mesB.opacityOut, currentYscroll),
          );
          objs.messageB.style.transform = `translate3d(0, ${calcValues(
            mesB.translateYout,
            currentYscroll,
          )}%, 0)`;
        }
      }
      if (
        objs.messageC &&
        mesC &&
        mesC.opacityIn &&
        mesC.opacityOut &&
        mesC.translateYin &&
        mesC.translateYout &&
        pinC
      ) {
        if (scrollRatio <= 0.62) {
          // In
          objs.messageC.style.opacity = String(
            calcValues(mesC.opacityIn, currentYscroll),
          );
          objs.messageC.style.transform = `translate3d(0, ${calcValues(
            mesC.translateYin,
            currentYscroll,
          )}%, 0)`;
          if (objs.pinC && pinC.scaleY) {
            objs.pinC.style.transform = `scaleY(${calcValues(pinC.scaleY, currentYscroll)})`;
          }
        } else {
          objs.messageC.style.opacity = String(
            calcValues(mesC.opacityOut, currentYscroll),
          );
          objs.messageC.style.transform = `translate3d(0, ${calcValues(
            mesC.translateYout,
            currentYscroll,
          )}%, 0)`;
        }
      }
      if (
        objs.messageD &&
        mesD &&
        mesD.opacityIn &&
        mesD.opacityOut &&
        mesD.translateYin &&
        mesD.translateYout &&
        pinD
      ) {
        if (scrollRatio <= 0.82) {
          // In
          objs.messageD.style.opacity = String(
            calcValues(mesD.opacityIn, currentYscroll),
          );
          objs.messageD.style.transform = `translate3d(0, ${calcValues(
            mesD.translateYin,
            currentYscroll,
          )}%, 0)`;
          if (objs.pinD && pinD.scaleY) {
            objs.pinD.style.transform = `scaleY(${calcValues(pinD.scaleY, currentYscroll)})`;
          }
        } else {
          objs.messageD.style.opacity = String(
            calcValues(mesD.opacityOut, currentYscroll),
          );
          objs.messageD.style.transform = `translate3d(0, ${calcValues(
            mesD.translateYout,
            currentYscroll,
          )}%, 0)`;
        }
      }

      // 3번 Scene canvas 미리 그려주기
      if (scrollRatio > 0.9) {
        const objs = sceneInfo[4].objs;
        const values = sceneInfo[4].values;
        if (objs.canvas && values) {
          // 각각의 비율이 나옴
          const widthRatio = window.innerWidth / objs.canvas.width; // 브라우저의 가로 폭 / 원래 canvas의 가로 폭
          const heightRatio = window.innerHeight / objs.canvas.height; // 브라우저의 세로 폭 / 원래 canvas의 세로 폭

          let canvasScaleRatio: number;

          // 비율에 따라서 canvas를 얼마나 크기 조절을 할 건지를 다르게 결정
          if (widthRatio <= heightRatio) {
            // canvas보다 브라우저 화면이 길죽한 경우
            canvasScaleRatio = heightRatio;

            // console.log("heightRatio로 결정");
          } else {
            // canvas보다 브라우저 화면이 납작한 경우
            canvasScaleRatio = widthRatio;

            // console.log("widthRatio로 결정");
          }
          objs.canvas.style.transform = `scale(${canvasScaleRatio})`;
          if (objs.context && objs.images) {
            objs.context.drawImage(objs.images[0], 0, 0);
          }

          // canvas 사이즈에 맞춰 가정한 innerWidth와 innerHeight
          // 이걸 이용해서 하얀 박스의 위치를 세팅할 것임
          const recalcultedInnerWidth =
            document.body.offsetWidth / canvasScaleRatio; // 스크롤 바 때문에 body의 offsetWidth 사용
          const recalcultedInnerHeight = window.innerHeight / canvasScaleRatio;

          // 하얀박스의 폭
          const whiteRectWidth = recalcultedInnerWidth * 0.15;
          if (values.rect1X && values.rect2X) {
            values.rect1X[0] = (objs.canvas.width - recalcultedInnerWidth) / 2;

            values.rect1X[1] = values.rect1X[0] - whiteRectWidth;

            values.rect2X[0] =
              values.rect1X[0] + recalcultedInnerWidth - whiteRectWidth;

            values.rect2X[1] = values.rect2X[0] + whiteRectWidth;

            // 그리기
            if (objs.context) {
              objs.context.fillRect(
                values.rect1X[0],
                0,
                Math.round(whiteRectWidth),
                objs.canvas.height,
              );
              objs.context.fillRect(
                values.rect2X[0],
                0,
                Math.round(whiteRectWidth),
                objs.canvas.height,
              );
              objs.context.fillStyle = "white";
            }
          }
        }
      }
      break;
    case 4:
      // console.log("4 play")
      // 가로 / 세로 모두 꽉 차게 하게 위해서 여기서 세팅(계산 필요)

      if (objs.canvas) {
        // 각각의 비율이 나옴
        const widthRatio = window.innerWidth / objs.canvas.width; // 브라우저의 가로 폭 / 원래 canvas의 가로 폭
        const heightRatio = window.innerHeight / objs.canvas.height; // 브라우저의 세로 폭 / 원래 canvas의 세로 폭

        let canvasScaleRatio: number;

        // 비율에 따라서 canvas를 얼마나 크기 조절을 할 건지를 다르게 결정
        if (widthRatio <= heightRatio) {
          // canvas보다 브라우저 화면이 길죽한 경우
          canvasScaleRatio = heightRatio;

          // console.log("heightRatio로 결정");
        } else {
          // canvas보다 브라우저 화면이 납작한 경우
          canvasScaleRatio = widthRatio;

          // console.log("widthRatio로 결정");
        }
        objs.canvas.style.transform = `scale(${canvasScaleRatio})`;
        if (objs.context && objs.images) {
          objs.context.drawImage(objs.images[0], 0, 0);
        }

        // canvas 사이즈에 맞춰 가정한 innerWidth와 innerHeight
        // 이걸 이용해서 하얀 박스의 위치를 세팅할 것임
        const recalcultedInnerWidth =
          document.body.offsetWidth / canvasScaleRatio; // 스크롤 바 때문에 body의 offsetWidth 사용
        const recalcultedInnerHeight = window.innerHeight / canvasScaleRatio;

        // 하얀박스의 폭
        const whiteRectWidth = recalcultedInnerWidth * 0.15;
        if (objs.context && values.rect1X && values.rect2X) {
          values.rect1X[0] = (objs.canvas.width - recalcultedInnerWidth) / 2;

          values.rect1X[1] = values.rect1X[0] - whiteRectWidth;

          values.rect2X[0] =
            values.rect1X[0] + recalcultedInnerWidth - whiteRectWidth;

          values.rect2X[1] = values.rect2X[0] + whiteRectWidth;

          if (!values.rectStartY) {
            // console.log(
            //   "원래 canvas 높이",
            //   objs.canvas.height,
            //   "줄어든 canvas 높이",
            //   objs.canvas.height * canvasScaleRatio,
            // );
            // 원래 canvas 높이 = objs.canvas.height
            // 줄어든 canvas의 높이는 원래 canvas 높이에다가 canvasScaleRatio를 곱하면 된다.
            values.rectStartY =
              objs.canvas.offsetTop +
              (objs.canvas.height - objs.canvas.height * canvasScaleRatio) / 2;

            // start 시점은 window 높이에 절반 정도로
            values.rect1X[2].start = window.innerHeight / 2 / scrollHeight;
            values.rect2X[2].start = window.innerHeight / 2 / scrollHeight;
            values.rect1X[2].end = values.rectStartY / scrollHeight;
            values.rect2X[2].end = values.rectStartY / scrollHeight;

            if (values.textOpacity) {
              values.textOpacity[2].start = values.rect1X[2].start;
              values.textOpacity[2].end = values.rect1X[2].end;
            }
          }

          // 그리기
          objs.context.fillStyle = "white";

          objs.context.fillRect(
            calcValues(values.rect1X, currentYscroll),
            0,
            Math.round(whiteRectWidth),
            objs.canvas.height,
          );
          objs.context.fillRect(
            calcValues(values.rect2X, currentYscroll),
            0,
            Math.round(whiteRectWidth),
            objs.canvas.height,
          );

          // 텍스트 그리기 추가

          if (values.textOpacity) {
            objs.context.globalAlpha = calcValues(
              values.textOpacity,
              currentYscroll,
            ); // 현재 스크롤에 따른 투명도 적용
          }

          objs.context.font = "bold 60px sans-serif";
          objs.context.textAlign = "center";
          objs.context.textBaseline = "middle";

          // 위치는 캔버스 중앙이나 사각형 사이 등 원하는 곳으로 설정

          objs.context.fillText(
            "샌물",
            objs.canvas.width / 2,
            objs.canvas.height / 2,
          );

          // 중요: 투명도를 다시 1로 되돌려놓아야 다음에 그려지는 요소들에 영향이 없습니다.
          objs.context.globalAlpha = 1;

          if (scrollRatio < values.rect1X[2].end) {
            objs.canvas.classList.remove("sticky");
          } else {
            // 첫 번째 canvas가 화면 최상단에 닿은 이후

            // 2 이후
            if (values.imageBlendHeight) {
              values.imageBlendHeight[0] = 0;
              values.imageBlendHeight[1] = objs.canvas.height;
              // 두 번째 cavnas의 start 시점은 첫 번째 canvas 이미지가 다 그려지고 난 후
              values.imageBlendHeight[2].start = values.rect1X[2].end;
              // start 시점으로부터 0.2 (end 시점은 본인이 정해야함 end 시점이 길수록 그만큼 많이 스크롤 해야함)
              values.imageBlendHeight[2].end =
                values.imageBlendHeight[2].start + 0.2;
              // values의 imageBlendHeight 를 계산한 결과를 변수에 담음
              const imageBlendHeight = calcValues(
                values.imageBlendHeight,
                currentYscroll,
              );

              if (objs.images) {
                //  drawImage(이미지객체, x 좌표 값, y 좌표 값, width 크기, height 크기 )
                // y 좌표는 canvas.height - imageBlendHeight 의 height
                /*
                    objs.images[1], 0, objs.canvas.height - values.imageBlendHeight[1], objs.canvas.width, values.imageBlendHeight[1] 소스 이미지에서 가져오는 부분
                    그 다음부터 실제 canvas에 그리는 부분

                    (원래 이미지 크기랑 canvas크기를 똑같이 세팅해 놓았음 수치 바꿀 필요없음)
                  */

                objs.context.drawImage(
                  objs.images[1],
                  0,
                  objs.canvas.height - imageBlendHeight,
                  objs.canvas.width,
                  imageBlendHeight,
                  0,
                  objs.canvas.height - imageBlendHeight,
                  objs.canvas.width,
                  imageBlendHeight,
                );
              }
              objs.canvas.classList.add("sticky");
              // top 수치를 원래 크기의 top 값 기준으로 해줘야한다.
              // objs.canvas.height * canvasScaleRatio = 조정된 canvas height
              // 원래 canvas height - objs.canvas.height * canvasScaleRatio / 2
              objs.canvas.style.top = `${-(objs.canvas.height - objs.canvas.height * canvasScaleRatio) / 2}px`;

              // imageBlend가 끝난 다음

              if (scrollRatio > values.imageBlendHeight[2].end) {
                if (values.imageBlendHeight && values.canvasScale) {
                  /* 초기값 */ values.canvasScale[0] = canvasScaleRatio;
                  /* 
                      최종값 

                      디자인 상으로 만족해야 될 기준은 이 브라우저가 얼마든 간에
                      브라우저의 폭보다 작아야 유지가 됨
                      비율을 정할 때 기준을 브라우저의 폭이 관여를 하게끔 해주자
                      (이 페이지를 열 때 데스크탑, 스마트폰 어떤 걸로 열지 모르니까)
                    */

                  // document.body.offsetWidth 의 비율
                  // 실제 화면(브라우저)이 캔버스 원본 해상도에 비해 몇 배 기로 보이고 있는가

                  // 분모의 값을 증가시켜서 결과값을 작게 만든다.
                  values.canvasScale[1] =
                    document.body.offsetWidth / (1.5 * objs.canvas.width);

                  values.canvasScale[2].start = values.imageBlendHeight[2].end;
                  /*
                      start 시점 이후에 얼마나 재생될지 duration 결정 씬의
                      전체 스크롤 height의 20%에 해당하는 구간 동안 재생이 됨

                      start + end = 0.4 40% 동안 
                    */
                  values.canvasScale[2].end = values.canvasScale[2].start + 0.2;

                  objs.canvas.style.transform = `scale(${calcValues(
                    values.canvasScale,
                    currentYscroll,
                  )})`;

                  // 스케일이 조정되기 전에는 margin-top을 0으로 세팅
                  objs.canvas.style.marginTop = "0";

                  // 스케일 조정된 후
                  // 여기선 values.canvasScale[2].end 의 값이 0이다 위 조건문에 해당하는 조건이 시작도 하지 않은 시점이라서
                  // 초기값 0으로 있을 때는 조건에 충족되지 않으니까 패스 values.canvasScale[2].end가 setting이 되고 0이 아닌 순간이 오면
                  if (
                    scrollRatio > values.canvasScale[2].end &&
                    values.canvasScale[2].end > 0
                  ) {
                    /*
                      첫 번째 canvas가 fixed인 시점 부터 스크롤을 우리가 얼마나
                      내렸는지를 알고 있다면 ... 어디까지? 두 번째 canvas의 scale까지 조정된 후 까지
                      스크롤을 얼마나 내렸는지 알고 있다면 얘가 position이 static으로 바뀌었을 때
                      margin-top을 가만히 고정되어 있을 동안 내렸던 그 스크롤 값으로 주면 될 것 같음
                      그 값을 margin-top으로 넣어주자

                      그게 얼만큼인가?
                      
                      scrollHeight 의 0.4배 40% 
                      canvas가 position fixed로 고정된 상태로 스크롤이 된 구간을 생각해 보면 
                      이미지 블랜드 끝나고 나서 축소될 때 2 구간인데 그 2 구간에 duration 시간이
                      0.2 였다 현재 씬(currentScene)의 전체 스크롤(scrollHeight)의 20% 동안 이미지 블랜드 처리를 했고
                      그 다음 20% 동안 scale 축소 처리를 했으니까 결국 0.4 = 40% 가 스크롤이 된 것임


                      첫 번째 이미지 블랜드 duration 0.2 = values.imageBlendHeight[2].end = values.imageBlendHeight[2].start + 0.2;
                      두 번째 이미지 블랜드 duration 0.2 = values.canvasScale[2].end = values.canvasScale[2].start + 0.2;

                      그럼 그 스크롤 된 만큼을 이 canvas의 margin-top으로 설정해주면 되겠다 
                    */
                    objs.canvas.classList.remove("sticky");
                    objs.canvas.style.marginTop = `${scrollHeight * 0.4}px`;

                    if (
                      values.canvasCaptionOpacity &&
                      values.canvasCaptionTranslateY
                    ) {
                      /* canvasCaptionOpacity 구간 */
                      // Caption 이 처음 보이기 시작하는 시점은 canvas가 scale로 조정되고 난 후 시점으로 맞춰주고
                      values.canvasCaptionOpacity[2].start =
                        values.canvasScale[2].end;

                      // end 시점은 start 시점으로부터 0.1 더해주기 10%만큼 스크롤 될 동안
                      values.canvasCaptionOpacity[2].end =
                        values.canvasCaptionOpacity[2].start + 0.1;

                      /* canvasCaptionTranslateY 구간 */
                      values.canvasCaptionTranslateY[2].start =
                        values.canvasScale[2].end;

                      values.canvasCaptionTranslateY[2].end =
                        values.canvasCaptionOpacity[2].start + 0.1;

                      if (objs && objs.canvasCaption) {
                        objs.canvasCaption.style.opacity = String(
                          calcValues(
                            values.canvasCaptionOpacity,
                            currentYscroll,
                          ),
                        );
                        objs.canvasCaption.style.transform = `translate3d(0, ${calcValues(
                          values.canvasCaptionTranslateY,
                          currentYscroll,
                        )}%, 0)`;
                      }
                    }
                  } else {
                    if (objs.canvasCaption && values.canvasCaptionOpacity) {
                      objs.canvasCaption.style.opacity = String(
                        values.canvasCaptionOpacity[0],
                      );
                    }
                  }
                }
              }
            }
          }
        }
      }
      break;
  }
};

const scrollLoop = () => {
  enterNewScene = false; // 스크롤 할때마다 기본적으로 false 적용 (바뀌는 순간에 true 적용)
  prevScrollHeight = 0; // 값 초기화 (누적 되는거 방지)
  // 현재 눈앞에 있는 씬이 몇 번째 씬인지 판별
  for (let i = 0; i < currentScene; i++) {
    prevScrollHeight = prevScrollHeight + sceneInfo[i].scrollHeight;
  }
  if (delaydscrollY < prevScrollHeight + sceneInfo[currentScene].scrollHeight) {
    // 현재 스크롤 된 위치가 이전 스크롤 된 것과 현재 씬의 스크롤 높이를 더한 것보다 작을 경우
    document.body.classList.remove("scrollEffectEnd");
  }

  // 스크롤 할 때마다 체크해서 currentScene의 값을 증감 / 감소 시켜주기
  if (delaydscrollY > prevScrollHeight + sceneInfo[currentScene].scrollHeight) {
    enterNewScene = true;
    console.log(currentScene);
    // 만약 또 하나의 section 이 추가 될 경우
    if (currentScene === sceneInfo.length - 1) {
      console.log("마지막 씬 접근");
      document.body.classList.add("scrollEffectEnd");
    }
    if (currentScene < sceneInfo.length - 1) {
      currentScene += 1;
    }

    // currentScene 으로 id 설정하는 거를 바뀔 때 마다 변경해주기
    document.body.setAttribute("id", `showScene${currentScene}`);
  }

  if (delaydscrollY < prevScrollHeight) {
    enterNewScene = true;
    if (currentScene === 0) return;
    currentScene -= 1;
    // currentScene 으로 id 설정하는 거를 바뀔 때 마다 변경해주기
    document.body.setAttribute("id", `showScene${currentScene}`);
  }

  if (enterNewScene) return;

  playAnimation();
};

const loop = () => {
  delaydscrollY = delaydscrollY + (yScroll - delaydscrollY) * acc;
  if (!enterNewScene) {
    if (currentScene === 3) {
      const currentYscroll: number = delaydscrollY - prevScrollHeight;
      const objs = sceneInfo[currentScene].objs;
      const values = sceneInfo[currentScene].values;
      if (
        objs &&
        values &&
        values.imageSequenc &&
        objs.context &&
        objs.videoImages
      ) {
        let sequence = Math.round(
          calcValues(values.imageSequenc, currentYscroll),
        );

        if (objs.videoImages[sequence]) {
          // 해당되는 sequence가 존재할 때만 실행되게
          objs.context.drawImage(objs.videoImages[sequence], 0, 0);
        }
      }
    }
  }

  rafId = requestAnimationFrame(loop);

  if (Math.abs(yScroll - delaydscrollY) < 1) {
    cancelAnimationFrame(rafId);
    rafState = false;
  }
};

window.addEventListener("load", () => {
  document.body.classList.remove("beforeLoad");
  setLayout();

  if (sceneInfo[3].objs.context && sceneInfo[3].objs.videoImages) {
    sceneInfo[3].objs.context.drawImage(sceneInfo[3].objs.videoImages[0], 0, 0);
  }

  let tempYscroll: number = yScroll; // 현재 스크롤 위치
  let tempScrollCount: number = 0; // 몇 번 스크롤 했는지 체크할 변수

  if (tempYscroll > 0) {
    let siId = setInterval(() => {
      window.scrollTo(0, tempYscroll);
      tempYscroll += 2;
      if (tempScrollCount > 10) {
        clearInterval(siId);
      }
      tempScrollCount += 1;
    }, 20);
  }

  window.addEventListener("scroll", () => {
    yScroll = window.scrollY;
    scrollLoop();

    if (!rafState) {
      rafId = requestAnimationFrame(loop);
      rafState = true;
    }
  });

  window.addEventListener("resize", () => {
    // 방향을 바꿀 때 setLayout이 작동되게 하고 resize에는 폰에서는 작동 안하게
    if (window.innerWidth > 900) {
      // 900 보다 클 경우에 실행 시켜줌
      window.location.reload();
      //   setLayout();
      //   if (sceneInfo[3].values) {
      //     /*
      //   ** 초기화 해준 이유 **

      //   3번씬에서 해주는 if (!values.rectStartY) { < 이 부분
      //   값이 안들어와있을때 값을 세팅해주는 구간인데
      //   저기서 세팅된 값을 기준으로 다른 애들이 잡히는 것인데
      //   end, start 값이 세팅이 되는데 그 end, start 값들이 다른 곳에서도 기준이 되버린다.

      //   그런데 이 값 자체가 세팅되고 나면 없어지지 않으니까 다시 세팅이 안될것임
      //   화면 사이즈를 바꿔도 다시 세팅이 안되니까 차이가 생기는 것임
      // */
      //     sceneInfo[3].values.rectStartY = 0;
      //   }
    }
  }); // 리사이징 후에도 함수 재실행

  // 모바일 기기를 가로 / 세로 방향 전환할 때 발생하는 이벤트
  window.addEventListener("orientationchange", () => {
    window.scrollTo(0, 0);
    setTimeout(() => {
      // setLayout();
      window.location.reload();
    }, 500);
  });
  const loadingElem = document.querySelector<HTMLDivElement>(".loading");
  if (loadingElem) {
    loadingElem.addEventListener("transitionend", (e: TransitionEvent) => {
      document.body.removeChild(loadingElem);
    });
  }
}); // load 리소스가 다 로드 된 후 함수 실행

setCanvasImages();
