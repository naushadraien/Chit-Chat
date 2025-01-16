import { COLORS } from "@/theme";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    gap: 6,
    zIndex: 1000,
  },
  inputContainer: {
    position: "relative",
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    paddingVertical: 8,
    paddingHorizontal: 14,
    backgroundColor: "white",
  },
  textInput: {
    paddingHorizontal: 16,
    paddingVertical: 4,
    borderColor: "gray",
    borderRadius: 50,
    color: COLORS.GREY800,
    fontSize: 16,
    flex: 1,
    height: 30,
  },
  dropdown: {
    position: "absolute",
    top: 52,
    left: 0,
    right: 0,
    backgroundColor: "white",
  },
  dropdownContent: {
    borderWidth: 1,
    borderRadius: 6,
    borderColor: COLORS.PRIMARY200,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginTop: 6,
  },
  option: {
    padding: 10,
    marginBottom: 2,
    gap: 10,
    borderRadius: 6,
  },
  optionText: {
    fontSize: 16,
  },
  noResult: {
    padding: 10,
  },
});
