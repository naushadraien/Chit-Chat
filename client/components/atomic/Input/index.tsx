import { Ionicons } from "@expo/vector-icons";
import React, { forwardRef, ReactNode, useState } from "react";
import {
  StyleProp,
  TextInput,
  TextInputProps,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";
import { Typography } from "../Typography";
import { styles } from "./style";
import { COLORS } from "@/theme";

export const MAX_INPUT_LENGTH = 100;

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  touched?: boolean;
  inputViewStyle?: StyleProp<ViewStyle>;
  mainContainerStyle?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
  rightIcon?: ReactNode;
  leftIcon?: ReactNode;
  onInputFocus?: () => void;
  onInputBlur?: () => void;
  success?: string;
  textCounts?: {
    enableTextCount?: boolean;
    textLength?: number;
  };
}

export const InputField = forwardRef<TextInput, InputProps>(
  (
    {
      label,
      error,
      touched,
      inputViewStyle,
      labelStyle,
      rightIcon,
      onInputFocus,
      success,
      onInputBlur,
      leftIcon,
      mainContainerStyle,
      maxLength = MAX_INPUT_LENGTH,
      ...rest
    }: InputProps,
    ref
  ) => {
    const { style: inputStyle, ...inputRestProps } = rest;

    const [isFocused, setIsFocused] = useState(false);

    const handleInputFocus = () => {
      setIsFocused(true);
      onInputFocus?.();
    };

    const handleInputBlur = () => {
      setIsFocused(false);
      onInputBlur?.();
    };

    return (
      <View style={[styles.container, mainContainerStyle]}>
        {label && (
          <Typography
            fontFamily="MULISH_SEMIBOLD"
            fontSize="MD"
            color={error && touched ? "REDFF7875" : "GREY700"}
            style={labelStyle}
          >
            {label}
          </Typography>
        )}
        <View
          style={[
            styles.inputContainer,
            {
              borderColor:
                error && touched
                  ? COLORS.REDFFCCC7
                  : isFocused
                  ? COLORS.PRIMARY200
                  : COLORS.GREY200,
            },
            inputViewStyle,
          ]}
        >
          {leftIcon && leftIcon}

          <TextInput
            ref={ref}
            style={[
              styles.input,
              {
                color: error && touched ? COLORS.REDFF4D4F : COLORS.GREY800,
              },
              inputStyle,
            ]}
            selectionColor="rgba(128, 128, 128, 0.5)"
            placeholderTextColor={COLORS.GREY600}
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
            maxLength={maxLength}
            {...inputRestProps}
          />
          {React.isValidElement(rightIcon) && rightIcon}
        </View>

        {inputRestProps.textCounts?.enableTextCount && (
          <Typography
            style={{
              lineHeight: 14.4,
              textAlign: "right",
            }}
            color="GREY700"
            fontFamily="MULISH_SEMIBOLD"
            fontSize="SM"
          >
            {inputRestProps.textCounts.textLength}/{maxLength}
          </Typography>
        )}
        {error && touched && (
          <View style={styles.errorContainer}>
            <View style={styles.errorIconContainer}>
              <Ionicons name="alert" size={15} color={COLORS.REDFF4D4F} />
            </View>
            <Typography
              fontFamily="MULISH_SEMIBOLD"
              fontSize="MD"
              color="REDFF4D4F"
            >
              {error}
            </Typography>
          </View>
        )}
        {success && (
          <View style={styles.successContainer}>
            <View style={styles.successIconContainer}>
              <Ionicons
                name="checkmark-outline"
                size={15}
                color={COLORS.GREENSUCCESS}
              />
            </View>
            <Typography
              fontFamily="MULISH_SEMIBOLD"
              fontSize="MD"
              color="GREENSUCCESS"
            >
              {success}
            </Typography>
          </View>
        )}
      </View>
    );
  }
);
