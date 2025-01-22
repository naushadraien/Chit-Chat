import { COLORS } from "@/theme";
import { Text, TouchableWithoutFeedback } from "react-native";

export const truncateText = (text: string, maxLength: number = 28) => {
  if (text.length <= maxLength) {
    return text;
  }
  return text.slice(0, maxLength) + "...";
};

export function highlightText({
  paragraph,
  highlightText,
  isPressableText = false,
  onPressText,
  isTextUnderline = false,
}: {
  paragraph: string;
  highlightText: string;
  isPressableText?: boolean;
  onPressText?: () => void;
  isTextUnderline?: boolean;
}) {
  const regex = new RegExp(`(${highlightText})`, "gi");
  const parts = paragraph.split(regex);

  return parts.map((part, index) =>
    regex.test(part) ? (
      isPressableText ? (
        <TouchableWithoutFeedback key={index} onPress={onPressText}>
          <Text
            style={{
              color: COLORS.PRIMARYBLUE,
              textDecorationLine: isTextUnderline ? "underline" : "none",
            }}
          >
            {part}
          </Text>
        </TouchableWithoutFeedback>
      ) : (
        <Text
          key={index}
          style={{
            color: COLORS.PRIMARYBLUE,
            textDecorationLine: isTextUnderline ? "underline" : "none",
          }}
        >
          {part}
        </Text>
      )
    ) : (
      <Text key={index}>{part}</Text>
    )
  );
}
export const capitalizeFirstLetter = (text: string) => {
  if (text.length === 0) return "";
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};

export const formatCountryCode = (text: string) => {
  // Remove all + symbols and whitespace, then add single + at start
  return "+" + text.replace(/\+/g, "").trim();
};
