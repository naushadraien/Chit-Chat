export type CommonProps = {
  onBack?: () => {};
};

export interface HeaderWithTitleProps extends CommonProps {
  title: string;
}

export interface HeaderWithSearchProps extends HeaderWithTitleProps {
  onSearch?: () => {};
  onPressMenu?: () => {};
}

export type HeaderProps =
  | ({ variant: "WithBackBTN" } & CommonProps)
  | ({ variant: "WithTitle" } & HeaderWithTitleProps)
  | ({ variant: "WithSearch" } & HeaderWithSearchProps);
