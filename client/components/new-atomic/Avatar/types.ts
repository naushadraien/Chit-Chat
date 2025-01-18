export type CommonPros = {
  gradientColor?: readonly [string, string, ...string[]];
  enableGradient?: boolean;
  isOnline?: boolean;
};

export interface AvatarWithImageProps extends CommonPros {
  imgUri?: string;
}

export interface WithoutImageProps extends CommonPros {
  firstName?: string;
  lastName?: string;
}

export type AvatarProps =
  | ({
      variant: "Image";
    } & AvatarWithImageProps)
  | ({ variant: "WithoutImage" } & WithoutImageProps);
