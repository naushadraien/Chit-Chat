import { Typography } from "@/components/atomic/Typography";
import React from "react";
import { StyleSheet, View, ViewStyle } from "react-native";

type Props = {
  title: string;
  rightComp?: React.ReactNode;
  containerStyle?: ViewStyle;
};

export default function WithTitleAndRightComp({
  title,
  rightComp,
  containerStyle,
}: Props) {
  return (
    <View style={[styles.container, containerStyle]}>
      <Typography fontFamily="MULISH_SEMIBOLD" fontSize="XL">
        {title}
      </Typography>
      {React.isValidElement(rightComp) && rightComp}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
  },
});
