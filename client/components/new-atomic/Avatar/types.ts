export type CommonProPs = {
  gradientColor?: readonly [string, string, ...string[]];
  enableGradient?: boolean;
  isOnline?: boolean;
  borderType?: "rounded" | "square";
};

export interface AvatarWithImageProps extends CommonProPs {
  imgUri?: string;
}

export interface WithoutImageProps extends CommonProPs {
  firstName?: string;
  lastName?: string;
}

export type AvatarProps =
  | ({
      variant: "Image";
    } & AvatarWithImageProps)
  | ({ variant: "WithoutImage" } & WithoutImageProps);
