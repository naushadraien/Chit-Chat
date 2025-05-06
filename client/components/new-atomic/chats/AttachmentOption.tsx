import { COLORS } from "@/theme";
import { Ionicons } from "@expo/vector-icons";
import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface AttachmentOptionProps {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  color: string;
  onPress: () => void;
  accessibilityLabel: string;
}

export const AttachmentOption = ({
  icon,
  label,
  color,
  onPress,
  accessibilityLabel,
}: AttachmentOptionProps) => (
  <TouchableOpacity
    style={styles.option}
    onPress={onPress}
    accessible={true}
    accessibilityLabel={accessibilityLabel}
    accessibilityRole="button"
  >
    <View style={[styles.iconContainer, { backgroundColor: color }]}>
      <Ionicons name={icon} size={24} color="white" />
    </View>
    <Text style={styles.optionLabel}>{label}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  option: {
    width: "33.33%",
    alignItems: "center",
    marginBottom: 24,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  optionLabel: {
    fontSize: 12,
    fontWeight: "500",
    color: COLORS.TEXTCOLOR,
  },
});
