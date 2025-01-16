import { Ionicons } from "@expo/vector-icons";
import React, {
  ReactNode,
  useCallback,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { Typography } from "../Typography";
import { styles } from "./style";
import { Options, SearchInputDropdownProps } from "./types";
import { COLORS } from "@/theme";

export function SearchInputWithDropdown({
  borderRadius = "square",
  label,
  onSearch,
  options = [],
  searchTerm = "",
  onOptionSelect,
  selectedLabel,
  rightIcon,
  placeholder = "Search",
  placeholderTextColor = COLORS.GREY500,
  onReset,
  isOptionsLoading = false,
  containerStyle,
}: SearchInputDropdownProps) {
  const inputRef = useRef<TextInput>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [inputValue, setInputValue] = useState(
    searchTerm || selectedLabel || ""
  );

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

  const filteredOptions = useMemo(
    () =>
      options.filter((item) =>
        item.label
          .trim()
          .toLowerCase()
          .includes(inputValue.trim().toLowerCase())
      ),
    [options, inputValue]
  );

  const handleSearch = useCallback(
    (search: string) => {
      setInputValue(search);
      onSearch?.(search);
      setIsDropdownVisible(!!search);
    },
    [onSearch]
  );

  const handleOptionSelect = useCallback(
    (label: string, otherFields: Options[0]["otherFields"]) => {
      setInputValue(label);
      onOptionSelect?.(label, otherFields);
      setIsDropdownVisible(false);
    },
    [onOptionSelect]
  );

  const handleReset = () => {
    setInputValue("");
    onOptionSelect?.("");
    onSearch?.("");
    onReset?.();
    if (isDropdownVisible) {
      setIsDropdownVisible(false);
    }
  };

  const handleOutsideClick = () => {
    if (isDropdownVisible || isFocused) {
      setIsDropdownVisible(false);
      setIsFocused(false);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={handleOutsideClick}>
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
                value={inputValue}
                onChangeText={handleSearch}
                placeholder={placeholder}
              />
              {inputValue ? (
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
            {isDropdownVisible && (
              <FlatList
                style={styles.dropdown}
                data={filteredOptions}
                contentContainerStyle={styles.dropdownContent}
                keyExtractor={(item, index) => item.label + index}
                renderItem={({ item }) => (
                  <Pressable
                    style={styles.option}
                    onPress={() =>
                      handleOptionSelect(item.label, item.otherFields)
                    }
                  >
                    <Text
                      style={[
                        styles.optionText,
                        {
                          fontWeight:
                            item.label === selectedLabel ? "600" : "400",
                          color:
                            item.label === selectedLabel ? "#005c00" : "#444",
                        },
                      ]}
                    >
                      {item.label}
                    </Text>
                  </Pressable>
                )}
                ListEmptyComponent={() =>
                  isOptionsLoading ? (
                    <ActivityIndicator
                      size="large"
                      color={COLORS.PRIMARYBLUE}
                    />
                  ) : (
                    <TouchableOpacity style={styles.noResult}>
                      <Typography
                        fontFamily="MULISH_SEMIBOLD"
                        fontSize="LG"
                        color={"GREY800"}
                      >
                        No result
                      </Typography>
                    </TouchableOpacity>
                  )
                }
              />
            )}
          </View>
        </TouchableWithoutFeedback>
      </View>
    </TouchableWithoutFeedback>
  );
}
