import { colors } from "@utils/theme";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    gap: 6,
    position: "relative",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderRadius: 6,
    padding: 10,
    backgroundColor: "white",
  },
  input: {
    paddingHorizontal: 16,
    paddingVertical: 4,
    borderColor: "gray",
    borderRadius: 50,
    fontSize: 16,
    flex: 1,
    height: 30,
  },
  errorContainer: {
    flexDirection: "row",
    gap: 4,
    alignItems: "center",
    marginTop: 6,
  },
  errorIconContainer: {
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderRadius: 100,
    borderColor: colors.REDFFA39E,
  },
  successContainer: {
    flexDirection: "row",
    gap: 4,
    alignItems: "center",
    marginTop: 6,
  },
  successIconContainer: {
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderRadius: 100,
    borderColor: colors.GREENB7EB8F,
  },
});
