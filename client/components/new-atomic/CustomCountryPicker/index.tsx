import { Typography } from "@/components/atomic/Typography";
import { countriesData } from "@/constants/Countries";
import { SPACINGS } from "@/theme";
import { formatCountryCode } from "@/utils/textHelpers";
import React, { useMemo, useRef, useState } from "react";
import {
  NativeSyntheticEvent,
  TextInput,
  TextInputKeyPressEventData,
  View,
} from "react-native";
import { InputField } from "../Input";

const findCountryFlag = (countryCode?: string) => {
  const realCountryCode = countryCode?.startsWith("+")
    ? countryCode
    : `+${countryCode}`;
  return countriesData.find((item) => item.dial_code === realCountryCode)?.flag;
};

interface CustomCountryPickerProps {
  defaultCountryCode?: string;
  defaultPhoneNumber?: string;
  onCountryCodeChange?: (code: string) => void;
  onPhoneNumberChange?: (number: string) => void;
  maxPhoneLength?: number;
}

export default function CustomCountryPicker({
  defaultCountryCode = "+353",
  defaultPhoneNumber = "",
  onCountryCodeChange,
  onPhoneNumberChange,
  maxPhoneLength = 10,
}: CustomCountryPickerProps) {
  const [countryCode, setCountryCode] = useState(
    formatCountryCode(defaultCountryCode)
  );
  const [phoneNumber, setPhoneNumber] = useState(defaultPhoneNumber);
  const inputRefs = useRef<TextInput[]>([]).current;

  // Keep this memoization as it involves array search
  const countryFlag = useMemo(
    () => findCountryFlag(countryCode),
    [countryCode]
  );

  // Keep this memoization as it prevents expensive array search on each render
  const isValidCountryCode = useMemo(
    () => countriesData.some((country) => country.dial_code === countryCode),
    [countryCode]
  );

  const handleCountryCodeChange = (text: string) => {
    const newCode = formatCountryCode(text);
    if (!isValidCountryCode || newCode.length <= countryCode.length) {
      setCountryCode(newCode);
      onCountryCodeChange?.(newCode);
    }
    if (countriesData.some((country) => country.dial_code === newCode)) {
      inputRefs[1]?.focus();
    }
  };

  const handlePhoneNumberChange = (text: string) => {
    setPhoneNumber(text);
    onPhoneNumberChange?.(text);
  };

  const handleKeyPress = (
    index: number,
    e: NativeSyntheticEvent<TextInputKeyPressEventData>
  ) => {
    if (e.nativeEvent.key === "Backspace" && index > 0 && !phoneNumber) {
      inputRefs[index - 1]?.focus();
    }
  };

  return (
    <View
      style={{
        flexDirection: "row",
        gap: SPACINGS.BASE,
        alignItems: "center",
      }}
    >
      <InputField
        ref={(el) => (inputRefs[0] = el!)}
        leftIcon={<Typography>{countryFlag}</Typography>}
        placeholder="+353"
        mainContainerStyle={{ flex: 1 / 3 }}
        value={countryCode}
        onChangeText={handleCountryCodeChange}
        keyboardType="number-pad"
      />
      <InputField
        ref={(el) => (inputRefs[1] = el!)}
        style={{ flex: 1 }}
        value={phoneNumber}
        onChangeText={handlePhoneNumberChange}
        onKeyPress={(e) => handleKeyPress(1, e)}
        keyboardType="number-pad"
        maxLength={maxPhoneLength}
        placeholder="Phone Number"
      />
    </View>
  );
}
