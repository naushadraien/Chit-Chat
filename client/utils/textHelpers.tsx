import { countriesData } from "@/constants/Countries";
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

export const formatPhoneNumber = (digitsOnly: string) => {
  let formatted = "";
  if (digitsOnly.length <= 3) {
    formatted = digitsOnly;
  } else if (digitsOnly.length <= 6) {
    formatted = `${digitsOnly.slice(0, 3)}-${digitsOnly.slice(3)}`;
  } else {
    formatted = `${digitsOnly.slice(0, 3)}-${digitsOnly.slice(
      3,
      6
    )}-${digitsOnly.slice(6, 10)}`;
  }
  return formatted;
};

//phoneE164 like: +9779846886766
export const extractPhoneParts = (phoneE164: string) => {
  const matchingCode =
    countriesData.find((code) => phoneE164.startsWith(code.dial_code))
      ?.dial_code || "+977";

  return {
    countryCode: matchingCode,
    nationalNumber: phoneE164.substring(matchingCode.length),
    formatted: `${matchingCode} ${formatPhoneNumber(
      phoneE164.substring(matchingCode.length)
    )}`,
  };
};
