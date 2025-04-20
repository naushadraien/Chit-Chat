import { Typography } from "@/components/atomic/Typography";
import { countriesData, CountryType } from "@/constants/Countries";
import { COLORS, SPACINGS } from "@/theme";
import { formatCountryCode, formatPhoneNumber } from "@/utils/textHelpers";
import { Ionicons } from "@expo/vector-icons";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { StyleSheet, TextInput, TouchableOpacity, View } from "react-native";
import { InputField } from "../Input";
import { CountryPickerModal } from "./CountryPickerModal";
import ErrorComponent from "../ErrorComponent";

const findCountryFlag = (countryCode?: string) => {
  const realCountryCode = countryCode?.startsWith("+")
    ? countryCode
    : `+${countryCode}`;
  return (
    countriesData.find((item) => item.dial_code === realCountryCode)?.flag ||
    "🌐"
  );
};

interface CustomCountryPickerProps {
  defaultCountryCode?: string;
  defaultPhoneNumber?: string;
  onCountryCodeChange?: (code: string) => void;
  onPhoneNumberChange?: (number: string) => void;
  maxPhoneLength?: number;
  error?: string;
  disabled?: boolean;
  label?: string;
}

export default function CustomCountryPicker({
  defaultCountryCode = "",
  defaultPhoneNumber = "",
  onCountryCodeChange,
  onPhoneNumberChange,
  maxPhoneLength = 10,
  error,
  disabled = false,
  label,
}: CustomCountryPickerProps) {
  const [countryCode, setCountryCode] = useState(
    formatCountryCode(defaultCountryCode)
  );
  const [phoneNumber, setPhoneNumber] = useState(defaultPhoneNumber);
  const [isCountryModalVisible, setCountryModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredCountries, setFilteredCountries] = useState(countriesData);

  const phoneInputRef = useRef<TextInput>(null);

  // Memoized values
  const countryFlag = useMemo(
    () => findCountryFlag(countryCode),
    [countryCode]
  );

  useEffect(() => {
    if (!searchQuery) {
      setFilteredCountries(countriesData);
      return;
    }

    const lowercaseQuery = searchQuery.toLowerCase();
    const filtered = countriesData.filter(
      (country) =>
        country.name.toLowerCase().includes(lowercaseQuery) ||
        country.dial_code.includes(lowercaseQuery)
    );

    setFilteredCountries(filtered);
  }, [searchQuery]);

  useEffect(() => {
    if (!isCountryModalVisible) {
      setSearchQuery("");
    }
  }, [isCountryModalVisible]);

  const handlePhoneNumberChange = useCallback(
    (text: string) => {
      const digitsOnly = text.replace(/\D/g, "");
      const formatted = formatPhoneNumber(digitsOnly);

      setPhoneNumber(formatted);
      onPhoneNumberChange?.(digitsOnly);
    },
    [onPhoneNumberChange]
  );

  const handleCountrySelect = useCallback(
    (country: CountryType) => {
      setCountryCode(country.dial_code);
      onCountryCodeChange?.(country.dial_code);
      setCountryModalVisible(false);

      setTimeout(() => {
        phoneInputRef.current?.focus();
      }, 300);
    },
    [onCountryCodeChange]
  );

  const handleDropdownModal = () => {
    setCountryModalVisible(!isCountryModalVisible);
  };

  return (
    <>
      {label && (
        <Typography
          fontFamily="MULISH_SEMIBOLD"
          fontSize="MD"
          color={error ? "REDFF7875" : "GREY700"}
          style={styles.label}
        >
          {label}
        </Typography>
      )}

      <View style={styles.container}>
        <TouchableOpacity
          onPress={() => !disabled && setCountryModalVisible(true)}
          style={styles.countryCodeContainer}
          activeOpacity={0.7}
          disabled={disabled}
        >
          <InputField
            leftIcon={
              <Typography style={styles.flagIcon}>{countryFlag}</Typography>
            }
            rightIcon={
              <Ionicons name="chevron-down" size={16} color={COLORS.GREY500} />
            }
            value={countryCode}
            placeholder="+353"
            editable={false}
            mainContainerStyle={styles.noMargin}
            inputViewStyle={[
              styles.codeInputView,
              disabled && styles.disabledInput,
            ]}
          />
        </TouchableOpacity>

        <View style={styles.phoneInputContainer}>
          <InputField
            ref={phoneInputRef}
            value={phoneNumber}
            onChangeText={handlePhoneNumberChange}
            keyboardType="number-pad"
            maxLength={maxPhoneLength + 2} // Account for formatting characters
            placeholder="Phone Number"
            editable={!disabled}
            mainContainerStyle={styles.noMargin}
            inputViewStyle={[
              styles.phoneInputView,
              disabled && styles.disabledInput,
            ]}
          />
        </View>
      </View>

      {error && <ErrorComponent error={error} />}

      <CountryPickerModal
        onClose={handleDropdownModal}
        onSelect={handleCountrySelect}
        visible={isCountryModalVisible}
        filteredCountryData={filteredCountries}
        searchTerm={searchQuery}
        onSearch={setSearchQuery}
        initialCountryCode={countryCode}
      />
    </>
  );
}

const styles = StyleSheet.create({
  label: {
    marginBottom: 8,
  },
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACINGS.BASE,
    width: "100%",
    marginBottom: 4,
  },
  countryCodeContainer: {
    width: 130,
    minWidth: 100,
  },
  phoneInputContainer: {
    flex: 1,
  },
  codeInputView: {
    height: 48,
  },
  phoneInputView: {
    height: 48,
  },
  noMargin: {
    marginBottom: 0,
  },
  disabledInput: {
    opacity: 0.7,
    backgroundColor: COLORS.GREY100,
  },
  flagIcon: {
    fontSize: 18,
  },
});
