const SPACINGS = {
  NONE: 0,
  XS: 2, // was TINY
  SM: 4, // was SMALL
  BASE: 8, // was BASE
  MD: 12, // was MEDIUM
  LG: 16, // was LARGE
  XL: 24, // was EXTRA_LARGE
  XXL: 32, // was SECTION
  XXXL: 40, // was EXTRA_SECTION
  SPACING_19: 19, // specific spacing
  GUTTER: 48,
  DOUBLE_GUTTER: 64,
} as const;

const RADII = {
  NONE: 0,
  XS: 2, // was TINY
  SM: 4, // was SMALL
  MD: 8, // was MEDIUM
  LG: 12, // was LARGE
  XL: 16, // was EXTRA_LARGE
  XXL: 24, // was SECTION
  RADIUS_18: 18, // specific radius
  PILL: 9999,
} as const;

export type SpacingType = keyof typeof SPACINGS;
export type RadiiType = keyof typeof RADII;

export { SPACINGS, RADII };
