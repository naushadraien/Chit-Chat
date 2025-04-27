export type CommonProps = {
  onBack?: VoidFunction;
};

export interface HeaderWithTitleProps extends CommonProps {
  title: string;
}

export interface HeaderWithSearchProps extends HeaderWithTitleProps {
  onSearch?: VoidFunction;
  onPressMenu?: VoidFunction;
}

export type HeaderProps =
  | ({ variant: "WithBackBTN" } & CommonProps)
  | ({ variant: "WithTitle" } & HeaderWithTitleProps)
  | ({ variant: "WithSearch" } & HeaderWithSearchProps);
