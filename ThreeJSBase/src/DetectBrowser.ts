
export const CHROME = 0;
export const EDGE = 1;
export const EDGE_CHROMIUM = 2;
export const OPERA = 3;
export const IE = 4;
export const FIREFOX = 5;
export const SAFARI = 6;
export const OTHER = 7;

const browser = (agent) => {
  switch (true) {
    case agent.indexOf("edge") > -1:
      return EDGE;
    case agent.indexOf("edg") > -1:
      return EDGE_CHROMIUM;
    //@ts-ignore
    case agent.indexOf("opr") > -1 && !!window.opr:
      return OPERA;
    //@ts-ignore
    case agent.indexOf("chrome") > -1 && !!window.chrome:
      return CHROME;
    case agent.indexOf("trident") > -1:
      return IE;
    case agent.indexOf("firefox") > -1:
      return FIREFOX;
    case agent.indexOf("safari") > -1:
      return SAFARI;
    default:
      return OTHER;
  }
};

export const getBrowser = () => {
    return browser(window.navigator.userAgent.toLowerCase());
}
