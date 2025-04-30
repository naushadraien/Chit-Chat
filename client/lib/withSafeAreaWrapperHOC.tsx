import {
  SafeAreaWrapper,
  SafeAreaWrapperProps,
} from "@/components/atomic/SafeAreaWrapper";
import React from "react";

export type WithSafeAreaWrapperHOCProps = {
  safeAreaProps?: Omit<SafeAreaWrapperProps, "children">;
};

export default function withSafeAreaWrapperHOC<P extends object>(
  WrappedComponent: React.ComponentType<P>
) {
  const HOC = (props: WithSafeAreaWrapperHOCProps & P) => {
    const { safeAreaProps, ...rest } = props;

    return (
      <SafeAreaWrapper {...safeAreaProps}>
        <WrappedComponent {...(rest as P)} />
      </SafeAreaWrapper>
    );
  };
  return HOC;
}
