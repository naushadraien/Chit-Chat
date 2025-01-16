import { ReactNode } from "react";
import { ViewStyle } from "react-native";

export type Options = Array<{
  label: string;
  otherFields?: {
    [key: string]: string;
  };
}>;

type CommonProps = {
  rightIcon?: ReactNode;
  onReset?: () => void;
  placeholder?: string;
  placeholderTextColor?: string;
  borderRadius?: "rounded" | "square";
  searchTerm?: string;
  onSearch?: (searchTerm: string) => void;
  label?: string;
  containerStyle?: ViewStyle;
};

export interface SearchInputDropdownProps extends CommonProps {
  searchTerm?: string;
  onSearch?: (searchTerm: string) => void;
  options?: Options;
  onOptionSelect?: (
    label: string,
    otherFields?: Options[0]["otherFields"]
  ) => void;
  selectedLabel?: string;
  isOptionsLoading?: boolean;
}

export type SearchInputWithoutDropdownProps = CommonProps;

export type SearchInputProps =
  | ({ variant: "Dropdown" } & SearchInputDropdownProps)
  | ({
      variant: "WithoutDropdown";
    } & SearchInputWithoutDropdownProps);
