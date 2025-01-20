import React from "react";
import {
  CommonProps,
  HeaderProps,
  HeaderWithSearchProps,
  HeaderWithTitleProps,
} from "./types";
import { WithBackBTN } from "./WithBackBTN";
import { WithSearch } from "./WithSearch";
import { WithTitle } from "./WithTitle";

export function Header({ variant, ...rest }: HeaderProps) {
  return (
    <>
      {variant === "WithBackBTN" && <WithBackBTN {...(rest as CommonProps)} />}
      {variant === "WithTitle" && (
        <WithTitle {...(rest as HeaderWithTitleProps)} />
      )}
      {variant === "WithSearch" && (
        <WithSearch {...(rest as HeaderWithSearchProps)} />
      )}
    </>
  );
}
