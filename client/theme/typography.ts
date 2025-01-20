const FONTFAMILIES = {
  MULISH_LIGHT: "Mulish-Light",
  MULISH_REGULAR: "Mulish-Regular",
  MULISH_BLACK: "Mulish-Black",
  MULISH_BOLD: "Mulish-Bold",
  MULISH_EXTRABOLD: "Mulish-ExtraBold",
  MULISH_MEDIUM: "Mulish-Medium",
  MULISH_SEMIBOLD: "Mulish-SemiBold",
  LATO_BOLD: "Lato-Bold",
} as const;

const FONTSIZES = {
  XS: 10, // Caption, small text
  SM: 12, // Small text
  MD: 14, // Body text
  LG: 16, // Large body text
  XL: 18, // Subtitle
  XXL: 20, // Small heading
  XXXL: 22, // Medium heading
  DISPLAY4: 24, // Display text
  DISPLAY3: 28, // Large display
  DISPLAY2: 32, // Larger display
  DISPLAY1: 36, // Largest display
  HERO: 48, // Hero text
  BILLBOARD: 64, // Billboard text
} as const;

const LINEHEIGHTS = {
  TIGHT: 1.2, // Headings
  NORMAL: 1.5, // Body text
  RELAXED: 1.75, // Large text
  LOOSE: 2, // Special cases
  // Absolute values (in pixels)
  XXS: 14, // Extra extra small
  XS: 16,
  SM: 20,
  MD: 24,
  LG: 28,
  XL: 32,
  XXL: 40,
  CUSTOM_30: 30,
} as const;

type FontFamilyType = keyof typeof FONTFAMILIES;
type FontSizeType = keyof typeof FONTSIZES;
type LineHeightType = keyof typeof LINEHEIGHTS;

export {
  FONTFAMILIES,
  FONTSIZES,
  LINEHEIGHTS,
  FontFamilyType,
  FontSizeType,
  LineHeightType,
};
