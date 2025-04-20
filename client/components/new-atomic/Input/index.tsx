import { Typography } from "@/components/atomic/Typography";
import { COLORS, FONTFAMILIES, FONTSIZES, LINEHEIGHTS } from "@/theme";
import React, { forwardRef } from "react";
import {
  StyleProp,
  StyleSheet,
  TextInput,
  TextInputProps,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";
import ErrorComponent from "../ErrorComponent";

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  inputViewStyle?: StyleProp<ViewStyle>;
  mainContainerStyle?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
  rightIcon?: React.ReactNode;
  leftIcon?: React.ReactNode;
}

export const InputField = forwardRef<TextInput, InputProps>(
  ({ label, leftIcon, rightIcon, error, labelStyle, ...restProps }, ref) => {
    const { style: inputStyle, ...inputRestProps } = restProps;

    return (
      <View style={[styles.container, inputRestProps.mainContainerStyle]}>
        {label && (
          <Typography
            fontFamily="MULISH_SEMIBOLD"
            fontSize="MD"
            color={error ? "REDFF7875" : "GREY700"}
            style={[styles.label, labelStyle]}
          >
            {label}
          </Typography>
        )}
        <View
          style={[
            styles.inputContainer,
            {
              borderColor: error ? COLORS.REDFF4D4F : COLORS.GREY200,
              borderWidth: 1,
            },
            inputRestProps.inputViewStyle,
          ]}
        >
          {leftIcon && <View style={styles.iconContainer}>{leftIcon}</View>}
          <TextInput
            ref={ref}
            placeholderTextColor={COLORS.GREYADB5BD}
            selectionColor={"rgba(59, 130, 246, 0.25)"}
            cursorColor={"#3B82F6"}
            style={[
              styles.input,
              {
                color: error ? COLORS.REDFF4D4F : COLORS.INPUTTEXTCOLOR,
                paddingLeft: leftIcon ? 0 : 12,
                paddingRight: rightIcon ? 0 : 12,
              },
              inputStyle,
            ]}
            {...inputRestProps}
          />
          {React.isValidElement(rightIcon) && (
            <View style={styles.iconContainer}>{rightIcon}</View>
          )}
        </View>
        {error && <ErrorComponent error={error} />}
      </View>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    width: "100%",
  },
  label: {
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 8,
    backgroundColor: COLORS.GREYF7F7FC,
    overflow: "hidden",
    height: 48,
  },
  input: {
    fontSize: FONTSIZES.MD,
    flex: 1,
    height: "100%",
    textAlign: "left",
    fontFamily: FONTFAMILIES.MULISH_REGULAR,
    lineHeight: LINEHEIGHTS.MD,
  },
  iconContainer: {
    paddingHorizontal: 12,
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
});
