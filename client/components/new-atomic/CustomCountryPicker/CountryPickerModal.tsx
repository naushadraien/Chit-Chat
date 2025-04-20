import { SearchInputWithoutDropdown } from "@/components/atomic/SearchInput/SearchInputWithoutDropdown";
import { Typography } from "@/components/atomic/Typography";
import { CountryType } from "@/constants/Countries";
import { COLORS } from "@/theme";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type Props = {
  visible: boolean;
  onClose: VoidFunction;
  onSelect: (item: CountryType) => void;
  filteredCountryData?: CountryType[];
  onSearch?: (value: string) => void;
  searchTerm?: string;
  initialCountryCode?: string;
};

export function CountryPickerModal({
  visible,
  onClose,
  onSelect,
  filteredCountryData,
  onSearch,
  searchTerm,
  initialCountryCode,
}: Props) {
  const { top } = useSafeAreaInsets();

  return (
    <Modal
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <View style={[styles.modalContainer, { paddingTop: top }]}>
        {/* Modal header */}
        <View style={styles.modalHeader}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={24} color={COLORS.GREY700} />
          </TouchableOpacity>

          <Typography fontFamily="MULISH_BOLD" fontSize="LG" color="GREY900">
            Select Country
          </Typography>

          <View style={styles.placeholder} />
        </View>

        {/* Search input */}
        <View style={styles.searchContainer}>
          <SearchInputWithoutDropdown
            searchTerm={searchTerm}
            onSearch={onSearch}
            placeholder="Search country or code"
          />
        </View>

        {/* Country list */}
        {filteredCountryData && filteredCountryData.length > 0 ? (
          <FlatList
            data={filteredCountryData}
            keyExtractor={(item) => item.code}
            renderItem={({ item }) => (
              <CountryItem
                initialCountryCode={initialCountryCode || ""}
                singleCountryData={item}
                onCountrySelect={onSelect}
              />
            )}
            initialNumToRender={20}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <View style={styles.emptyContainer}>
            <Ionicons name="search-outline" size={64} color={COLORS.GREY200} />
            <Typography
              fontFamily="MULISH_SEMIBOLD"
              fontSize="MD"
              color="GREY500"
              style={{ marginTop: 16 }}
            >
              No countries found
            </Typography>
          </View>
        )}
      </View>
    </Modal>
  );
}

function CountryItem({
  onCountrySelect,
  singleCountryData,
  initialCountryCode,
}: {
  singleCountryData: CountryType;
  onCountrySelect: (item: CountryType) => void;
  initialCountryCode: string;
}) {
  return (
    <TouchableOpacity
      style={[
        styles.countryItem,
        initialCountryCode === singleCountryData.dial_code &&
          styles.selectedCountryItem,
      ]}
      onPress={() => onCountrySelect(singleCountryData)}
      activeOpacity={0.7}
    >
      <Text style={styles.countryFlag}>{singleCountryData.flag}</Text>
      <Text style={styles.countryName} numberOfLines={1} ellipsizeMode="tail">
        {singleCountryData.name}
      </Text>
      <Text style={styles.countryCode}>{singleCountryData.dial_code}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: "white",
  },
  modalHeader: {
    height: 56,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.GREY100,
  },
  closeButton: {
    padding: 8,
  },
  placeholder: {
    width: 40, // Same width as close button for balanced header
  },
  searchContainer: {
    padding: 16,
  },
  listContent: {
    paddingBottom: 24,
  },
  countryItem: {
    flexDirection: "row",
    padding: 16,
    alignItems: "center",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: COLORS.GREY400,
  },
  selectedCountryItem: {
    backgroundColor: COLORS.GREYF7F7FC,
  },
  countryFlag: {
    fontSize: 20,
    marginRight: 12,
  },
  countryName: {
    fontSize: 16,
    color: COLORS.GREY800,
    flex: 1,
  },
  countryCode: {
    fontSize: 14,
    color: COLORS.GREY500,
    marginLeft: 8,
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 100, // Account for keyboard
  },
});
