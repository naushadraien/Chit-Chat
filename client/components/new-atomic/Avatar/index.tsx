import React from "react";
import AvatarWithImage from "./AvatarWithImage";
import AvatarWithoutImage from "./AvatarWithoutImage";
import { AvatarProps, AvatarWithImageProps, WithoutImageProps } from "./types";

export function Avatar({ variant, ...restProps }: AvatarProps) {
  return (
    <>
      {variant === "Image" ? (
        <AvatarWithImage {...(restProps as AvatarWithImageProps)} />
      ) : variant === "WithoutImage" ? (
        <AvatarWithoutImage {...(restProps as WithoutImageProps)} />
      ) : null}
    </>
  );
}
