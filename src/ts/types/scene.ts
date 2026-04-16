export type AnimationValue = [number, number, { start: number; end: number }];

export type AnimValue = [number, number] | AnimationValue;

export interface MessageAnimations {
  opacityIn?: AnimationValue;
  opacityOut?: AnimationValue;
  translateYin?: AnimationValue;
  translateYout?: AnimationValue;
}
export interface senmulAnimations {
  senmulLogoWidthIn?: AnimationValue;
  senmulLogoWidthOut?: AnimationValue;
  senmulLogoTransfromXin?: AnimationValue;
  senmulLogoTransfromXout?: AnimationValue;
  senmulLogoOpacityOut?: AnimationValue;
}

export interface pathElemAnimations {
  pathDashoffsetIn: AnimationValue;
  pathDashoffsetOut: AnimationValue;
}

export interface PinAnimations {
  scaleY?: AnimationValue;
  opacityIn?: AnimationValue;
  opacityOut?: AnimationValue;
}

export interface Objs {
  container: HTMLElement | null;
  wrapper?: HTMLElement | null;
  messageA?: HTMLDivElement | null;
  messageB?: HTMLDivElement | null;
  messageC?: HTMLDivElement | null;
  messageD?: HTMLDivElement | null;
  senmulLogo?: HTMLObjectElement | null;
  pathElem?: SVGPathElement | null;
  pinB?: HTMLDivElement | null;
  pinC?: HTMLDivElement | null;
  pinD?: HTMLDivElement | null;
  canvas?: HTMLCanvasElement | null;
  context?: CanvasRenderingContext2D | null;
  videoImages?: HTMLImageElement[] | null;
  canvasCaption?: HTMLElement | null;
  imagesPath?: string[];
  images?: HTMLImageElement[] | null;
}

export interface SceneValues {
  traX?: AnimationValue;
  messageA?: MessageAnimations;
  messageB?: MessageAnimations;
  messageC?: MessageAnimations;
  messageD?: MessageAnimations;
  senmulLogoValue?: senmulAnimations;
  pathElem?: pathElemAnimations;
  pinB?: PinAnimations;
  pinC?: PinAnimations;
  pinD?: PinAnimations;
  videoImageCount?: number;
  imageSequenc?: [number, number];
  canvasOpacityIn?: AnimationValue;
  canvasOpacityOut?: AnimationValue;
  rect1X?: AnimationValue;
  rect2X?: AnimationValue;
  imageBlendHeight?: AnimationValue;
  canvasScale?: AnimationValue;
  rectStartY?: number;
  textOpacity?: AnimationValue;
  canvasCaptionOpacity?: AnimationValue;
  canvasCaptionTranslateY?: AnimationValue;
}

export interface SceneInfo {
  type: string;
  heightNum?: number | null;
  scrollHeight: number;
  objs: Objs;
  values?: SceneValues;
}
