import { Ionicons } from "@expo/vector-icons";
import React, { useCallback, useRef, useState } from "react";
import { TextInput, TouchableWithoutFeedback, View } from "react-native";
import { Typography } from "../Typography";
import { styles } from "./style";
import { SearchInputWithoutDropdownProps } from "./types";
import { COLORS } from "@/theme";

export function SearchInputWithoutDropdown({
  borderRadius = "square",
  label,
  onSearch,
  searchTerm = "",
  rightIcon,
  placeholder = "Search",
  placeholderTextColor = COLORS.GREY500,
  onReset,
  containerStyle,
}: SearchInputWithoutDropdownProps) {
  const inputRef = useRef<TextInput>(null);
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = useCallback(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleInputFocus = useCallback(() => {
    setIsFocused(true);
  }, []);

  const handleInputBlur = useCallback(() => {
    setIsFocused(false);
  }, []);

  const handleReset = () => {
    onSearch?.("");
    onReset?.();
  };

  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <Typography
          fontFamily="MULISH_SEMIBOLD"
          fontSize="MD"
          color={"GREY700"}
        >
          {label}
        </Typography>
      )}
      <TouchableWithoutFeedback onPress={handleFocus}>
        <View style={styles.inputContainer}>
          <View
            style={[
              styles.inputWrapper,
              {
                borderColor: isFocused ? COLORS.PRIMARY200 : COLORS.GREY200,
                borderRadius: borderRadius === "square" ? 6 : 90,
              },
            ]}
          >
            <Ionicons
              name="search-outline"
              size={22}
              color={isFocused ? COLORS.PRIMARY600 : COLORS.GREY500}
            />
            <TextInput
              placeholderTextColor={placeholderTextColor}
              ref={inputRef}
              style={styles.textInput}
              selectionColor="rgba(128, 128, 128, 0.5)"
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
              value={searchTerm}
              onChangeText={onSearch}
              placeholder={placeholder}
            />
            {searchTerm ? (
              <Ionicons
                name="close-outline"
                size={22}
                color={COLORS.PRIMARY600}
                onPress={handleReset}
              />
            ) : (
              rightIcon
            )}
          </View>
        </View>
      </TouchableWithoutFeedback>
    </View>
  );
}
