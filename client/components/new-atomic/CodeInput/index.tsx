import { COLORS, FONTSIZES } from "@/theme";
import React, { useRef, useState } from "react";
import { Dimensions, TextInput, View } from "react-native";

const screenWidth = Dimensions.get("window").width;

const inputWidth = Math.min(60, screenWidth / 8);
interface CodeInputProps {
  handleCodeInput: (value: string) => void;
  inputCount: number;
}

export const CodeInput = ({ handleCodeInput, inputCount }: CodeInputProps) => {
  const [code, setCode] = useState(Array(inputCount).fill(""));
  const [lastKeyEventTimestamp, setLastKeyEventTimestamp] = useState(0);
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);
  const inputRefs = useRef<Array<TextInput | null>>([]);

  const handleTextChange = (index: number, text: string) => {
    // Handle pasted text
    if (text.length > 1) {
      const digits = text.split("").slice(0, inputCount);
      const newCode = [...code];
      digits.forEach((digit, idx) => {
        if (idx < inputCount) {
          newCode[idx] = digit;
        }
      });
      setCode(newCode);
      handleCodeInput(newCode.join(""));
      // Focus last input after paste
      if (digits.length === inputCount) {
        inputRefs.current[inputCount - 1]?.focus();
      }
      return;
    }

    // Handle single digit input
    const newCode = [...code];
    newCode[index] = text;
    setCode(newCode);
    handleCodeInput(newCode.join(""));

    if (text && index < inputCount - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-evenly",
      }}
    >
      {Array.from({ length: inputCount }, (_, index) => (
        <TextInput
          style={{
            flex: 1,
            aspectRatio: 1,
            maxWidth: inputWidth,
            borderWidth: index !== focusedIndex ? 1 : 2,
            borderColor:
              index !== focusedIndex ? COLORS.GREY200 : COLORS.PRIMARY400,
            borderRadius: 10,
            textAlign: "center",
            fontSize: FONTSIZES.XXL,
          }}
          key={index}
          value={code[index]}
          ref={(el: any) => (inputRefs.current[index] = el)}
          keyboardType="number-pad"
          onFocus={() => setFocusedIndex(index)}
          maxLength={index === 0 ? inputCount : 1}
          onBlur={() => setFocusedIndex(null)}
          onChangeText={(text: string) => handleTextChange(index, text)}
          onKeyPress={(e) => {
            if (e.nativeEvent.key === "Backspace") {
              if (Math.abs(lastKeyEventTimestamp - e.timeStamp) < 20) return;
              if (!code[index] && index > 0) {
                const newCode = [...code];
                newCode[index - 1] = "";
                setCode(newCode);
                handleCodeInput(newCode.join(""));
                inputRefs.current[index - 1]?.focus();
              }
            } else {
              setLastKeyEventTimestamp(e.timeStamp);
            }
          }}
        />
      ))}
    </View>
  );
};
