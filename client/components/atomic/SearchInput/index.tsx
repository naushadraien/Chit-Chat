import React from "react";
import { SearchInputWithDropdown } from "./SearchInputWithDropdown";
import { SearchInputWithoutDropdown } from "./SearchInputWithoutDropdown";
import {
  SearchInputDropdownProps,
  SearchInputProps,
  SearchInputWithoutDropdownProps,
} from "./types";

export function SearchInput(props: SearchInputProps) {
  const { variant, ...rest } = props;
  return (
    <>
      {variant === "Dropdown" ? (
        <SearchInputWithDropdown {...(rest as SearchInputDropdownProps)} />
      ) : (
        <SearchInputWithoutDropdown
          {...(rest as SearchInputWithoutDropdownProps)}
        />
      )}
    </>
  );
}
