import { DocumentResult, selectMultipleDocuments } from "@/utils/file.utils";
import React from "react";
import { Alert } from "react-native";
import { AttachmentOption } from "./AttachmentPanel";

interface DocumentPickerProps {
  onSelect: (files: DocumentResult[]) => void;
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
      <AttachmentOption
        icon="document-text"
        label="Document"
        color="#FF9800"
        onPress={handlePickDocument}
        accessibilityLabel="Select a document"
      />
    </>
  );
};
