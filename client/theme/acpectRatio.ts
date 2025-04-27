export const ASPECT_RATIO = {
  landscape: {
    x: 16,
    y: 9,
    ratio: 1.78,
  },
  portrait: {
    x: 12,
    y: 11,
    ratio: 1.09,
  },
  square: {
    x: 4,
    y: 4,
    ratio: 1,
  },
};

export type AspectRatioType = keyof typeof ASPECT_RATIO;
