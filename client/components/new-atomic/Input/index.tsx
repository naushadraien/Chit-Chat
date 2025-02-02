import { Typography } from "@/components/atomic/Typography";
import { COLORS, FONTFAMILIES, FONTSIZES, LINEHEIGHTS } from "@/theme";
import { Ionicons } from "@expo/vector-icons";
import React, { forwardRef, useState } from "react";
import {
  StyleProp,
  StyleSheet,
  TextInput,
  TextInputProps,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";

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
            style={labelStyle}
          >
            {label}
          </Typography>
        )}
        <View
          style={[
            styles.inputContainer,
            {
              borderColor: COLORS.GREY200,
            },
            inputRestProps.inputViewStyle,
          ]}
        >
          {leftIcon && leftIcon}
          <TextInput
            ref={ref}
            placeholderTextColor={COLORS.GREYADB5BD}
            selectionColor={COLORS.GREYADB5BD}
            style={[
              styles.input,
              {
                color: error ? COLORS.REDFF4D4F : COLORS.INPUTTEXTCOLOR,
              },
              ,
              inputStyle,
            ]}
            {...inputRestProps}
          />
          {React.isValidElement(rightIcon) && rightIcon}
        </View>
        {error && (
          <View style={styles.errorContainer}>
            <View style={styles.errorIconContainer}>
              <Ionicons name="alert" size={15} color={COLORS.REDFF4D4F} />
            </View>
            <Typography
              fontFamily="MULISH_SEMIBOLD"
              fontSize="MD"
              color="REDFF4D4F"
              style={{
                flex: 1,
              }}
            >
              {error}
            </Typography>
          </View>
        )}
      </View>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    gap: 6,
    flex: 1,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 4,
    paddingHorizontal: 8,
    // paddingVertical: 6,
    backgroundColor: COLORS.GREYF7F7FC,
  },
  input: {
    // marginTop: 4,
    fontSize: FONTSIZES.MD,
    flex: 1,
    paddingVertical: 6,
    height: 36,
    textAlign: "left",
    fontFamily: FONTFAMILIES.MULISH_SEMIBOLD,
    lineHeight: LINEHEIGHTS.MD,
  },
  errorContainer: {
    flexDirection: "row",
    gap: 4,
    alignItems: "center",
    marginTop: 6,
  },
  errorIconContainer: {
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderRadius: 100,
    borderColor: COLORS.REDFFA39E,
  },
});
