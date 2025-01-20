export const COLORS = {
  PRIMARY: "#22DD33",
  TEXTCOLOR: "#000",
  INPUTTEXTCOLOR: "#0F1828",
  WHITE: "#fff",
  GREYF7F7FC: "#F7F7FC",
  GREY50: "#F5F5F5",
  GREY100: "#ECECEC",
  GREY400: "#B1B1B1",
  GREY900: "#202020",
  GREY200: "#D8D8D8",
  GREY500: "#9E9E9E",
  GREY600: "#7E7E7E",
  GREY700: "#5F5F5F",
  GREY800: "#3F3F3F",
  GREYADB5BD: "#ADB5BD",
  GREYEDEDED: "#EDEDED",
  GREYA4A4A4: "#A4A4A4",
  BRANDCOLOR: "#002DE3",
  PRIMARYBLUE: "#003dab",
  ROYAL_BLUE: "#00177A",
  BLUED2D5F9: "#D2D5F9",
  BLUE7F86ED: "#7F86ED",
  BLUE2C37E1: "#2C37E1",
  BLUE166FF6: "#166FF6",
  REDFF7875: "#FF7875",
  REDFFCCC7: "#FFCCC7",
  REDFF4D4F: "#FF4D4F",
  REDFFA39E: "#FFA39E",
  TRANSPARENT: "transparent",
  PURPLE100: "#F1EFFB",
  PURPLE200: "#E3DFF6",
  PURPLE300: "#D5CFF2",
  PURPLE400: "#C7BFEE",
  PURPLE500: "#B8AFE9",
  PURPLE600: "#AA9EE5",
  PURPLE700: "#9C8EE1",
  PURPLE800: "#8E7EDD",
  PURPLE900: "#806ED8",
  PURPLE: "#725ED4",
  DEEPNAVY400: "#9EA1B1",
  DEEPNAVY: "#0C133D",
  PRIMARY200: "#CCD8EE",
  PRIMARY600: "#668BCB",
  GREENB7EB8F: "#B7EB8F",
  GREENSUCCESS: "#2CC069",
  PRIMARY100: "#E5ECF6",
  PRIMARY300: "#B3C5E5",
  PRIMARY400: "#99B1DC",
  PRIMARY700: "#4D77C2",
  PRIMARY800: "#3364B9",
  REDFFF1F0: "#FFF1F0",
  ALERT: "#FF4D4F",
  BLUEC8EDFF: "#C8EDFF",
  BLUEE6F7FF: "#E6F7FF",
  BLUEE096DD9: "#096DD9",
  BLUE91D5FF: "#91D5FF",
  PINK: "#CA58A2",
  PINK_100: "#faeef6",
  PINK_200: "#f4deec",
  PINK_300: "#efcde3",
  PINK_800: "#d579b5",
  PINK_900: "#CF69AB",
  MODAL_BG: "#00000033",
  NONE: undefined,
} as const;

export type ColorsType = keyof typeof COLORS;
