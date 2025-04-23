import { COLORS, FONTSIZES } from "@/theme";
import React, { memo, useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Keyboard,
  Platform,
  StyleSheet,
  TextInput,
  View,
} from "react-native";
import ErrorComponent from "../ErrorComponent";
import * as Haptics from "expo-haptics";

const screenWidth = Dimensions.get("window").width;
const inputWidth = Math.min(60, screenWidth / 8);

interface CodeInputProps {
  handleCodeInput: (value: string) => void;
  inputCount: number;
  autofocus?: boolean;
  error?: string;
  disabled?: boolean;
  onSubmit?: () => void;
}

const CodeInput = ({
  handleCodeInput,
  inputCount,
  autofocus = true,
  error,
  disabled = false,
  onSubmit,
}: CodeInputProps) => {
  const [code, setCode] = useState<Array<string>>(Array(inputCount).fill(""));
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const inputRefs = useRef<Array<TextInput | null>>([]);
  const animatedValues = useRef<Animated.Value[]>(
    Array(inputCount)
      .fill(0)
      .map(() => new Animated.Value(0))
  );

  // Auto-focus first input on mount
  useEffect(() => {
    if (autofocus && inputRefs.current[0]) {
      setTimeout(() => {
        inputRefs.current[0]?.focus();
      }, 100);
    }
  }, [autofocus]);

  // Animate focused input
  useEffect(() => {
    animatedValues.current.forEach((anim, index) => {
      Animated.timing(anim, {
        toValue: index === focusedIndex ? 1 : 0,
        duration: 200,
        useNativeDriver: false,
      }).start();
    });
  }, [focusedIndex]);

  useEffect(() => {
    setHasSubmitted(false);
  }, [code.join("")]);

  // Check if code is complete and submit
  useEffect(() => {
    const isComplete = code.every((digit) => digit !== "");
    if (isComplete && code.length === inputCount && !hasSubmitted) {
      Keyboard.dismiss();
      setHasSubmitted(true); // Set flag to prevent multiple submissions
      setTimeout(() => {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        onSubmit?.();
      }, 300);
    }
  }, [code, inputCount, onSubmit, hasSubmitted]);

  const handleTextChange = (index: number, text: string) => {
    // Remove non-digit characters
    const sanitizedText = text.replace(/[^0-9]/g, "");

    // Handle pasted text
    if (sanitizedText.length > 1) {
      const digits = sanitizedText.split("").slice(0, inputCount);
      const newCode = [...code];

      digits.forEach((digit, idx) => {
        if (idx < inputCount) {
          newCode[idx] = digit;
        }
      });

      setCode(newCode);
      handleCodeInput(newCode.join(""));

      // Focus last filled input or next empty input
      const nextEmptyIndex = newCode.findIndex((d) => d === "");
      const targetIndex =
        nextEmptyIndex === -1 ? inputCount - 1 : nextEmptyIndex;
      inputRefs.current[targetIndex]?.focus();
      return;
    }

    // Handle single digit input
    const newCode = [...code];
    newCode[index] = sanitizedText;
    setCode(newCode);
    handleCodeInput(newCode.join(""));

    // Auto-advance to next input if current one is filled
    if (sanitizedText && index < inputCount - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (index: number, key: string) => {
    // Handle backspace navigation
    if (key === "Backspace") {
      if (!code[index] && index > 0) {
        const newCode = [...code];
        newCode[index - 1] = "";
        setCode(newCode);
        handleCodeInput(newCode.join(""));
        inputRefs.current[index - 1]?.focus();
      }
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        {Array.from({ length: inputCount }, (_, index) => {
          // Create border animations
          const borderWidth = animatedValues.current[index].interpolate({
            inputRange: [0, 1],
            outputRange: [1, 2],
          });

          const borderColor = animatedValues.current[index].interpolate({
            inputRange: [0, 1],
            outputRange: [COLORS.GREY200, COLORS.PRIMARY400],
          });

          return (
            <Animated.View
              key={index}
              style={[
                styles.inputWrapper,
                {
                  borderWidth,
                  borderColor,
                  opacity: disabled ? 0.6 : 1,
                  backgroundColor: disabled ? COLORS.GREY100 : COLORS.WHITE,
                },
                error && styles.inputError,
              ]}
            >
              <TextInput
                style={[styles.input, code[index] ? styles.filledInput : null]}
                value={code[index]}
                ref={(el) => (inputRefs.current[index] = el)}
                keyboardType="number-pad"
                onFocus={() => setFocusedIndex(index)}
                maxLength={index === 0 ? inputCount : 1}
                onBlur={() => setFocusedIndex(null)}
                onChangeText={(text) => handleTextChange(index, text)}
                onKeyPress={(e) => handleKeyPress(index, e.nativeEvent.key)}
                editable={!disabled}
                caretHidden={Platform.OS === "android"}
                selectTextOnFocus
                accessible={true}
                accessibilityLabel={`Verification code digit ${index + 1}`}
                accessibilityHint={`Enter digit ${
                  index + 1
                } of your verification code`}
              />
            </Animated.View>
          );
        })}
      </View>

      {error && <ErrorComponent error={error} />}
    </View>
  );
};

export default memo(CodeInput);

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
  },
  inputWrapper: {
    flex: 1,
    aspectRatio: 1,
    maxWidth: inputWidth,
    borderRadius: 12,
    marginHorizontal: 4,
    overflow: "hidden",
    backgroundColor: COLORS.WHITE,
    justifyContent: "center",
    alignItems: "center",
  },
  input: {
    width: "100%",
    height: "100%",
    textAlign: "center",
    fontSize: FONTSIZES.XXL,
    color: COLORS.GREY800,
    padding: 0,
  },
  filledInput: {
    fontWeight: "600",
    color: COLORS.GREY900,
  },
  inputError: {
    borderColor: COLORS.REDFF4D4F,
  },
});
