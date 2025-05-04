import { COLORS } from "@/theme";
import { DocumentResult, selectMultipleDocuments } from "@/utils/file.utils";
import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface DocumentPickerProps {
  onSelect: (file: DocumentResult[]) => void;
}

export const DocumentPicker = ({ onSelect }: DocumentPickerProps) => {
  const handlePickDocument = async () => {
    try {
      const result = await selectMultipleDocuments();
      console.log("🚀 ~ handlePickDocument ~ result:", result);
      if (result && result.length > 0) {
        onSelect(result);
      }
    } catch (error) {
      console.log("Error picking document:", error);
      Alert.alert("Error", "Failed to select document");
    }
  };

  return (
    <>
      <TouchableOpacity style={styles.container} onPress={handlePickDocument}>
        <View style={[styles.iconBackground, { backgroundColor: "#E91E63" }]}>
          <MaterialIcons name="attach-file" size={22} color={COLORS.WHITE} />
        </View>
        <Text style={styles.label}>File</Text>
      </TouchableOpacity>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    width: 80,
  },
  iconBackground: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  label: {
    fontSize: 12,
    color: COLORS.GREY600,
    marginTop: 4,
  },
});
