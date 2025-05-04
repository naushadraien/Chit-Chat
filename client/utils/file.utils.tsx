import * as DocumentPicker from "expo-document-picker";
import * as Linking from "expo-linking";
import { Alert } from "react-native";

import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { COLORS } from "@/theme";

export const getFileIcon = (fileType: string): JSX.Element => {
  switch (fileType.toLowerCase()) {
    case "pdf":
      return (
        <MaterialIcons name="picture-as-pdf" size={24} color={COLORS.PRIMARY} />
      );
    case "doc":
    case "docx":
      return (
        <MaterialIcons name="description" size={24} color={COLORS.PRIMARY} />
      );
    case "xls":
    case "xlsx":
      return (
        <MaterialCommunityIcons
          name="file-excel"
          size={24}
          color={COLORS.PRIMARY}
        />
      );
    case "ppt":
    case "pptx":
      return (
        <MaterialCommunityIcons
          name="file-powerpoint"
          size={24}
          color={COLORS.PRIMARY}
        />
      );
    case "jpg":
    case "jpeg":
    case "png":
      return <MaterialIcons name="image" size={24} color={COLORS.PRIMARY} />;
    default:
      return (
        <MaterialIcons
          name="insert-drive-file"
          size={24}
          color={COLORS.PRIMARY}
        />
      );
  }
};

export const getFileSize = (bytes: number): string => {
  const units = ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
  let size = bytes;
  let unitIndex = 0;

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }

  return `${size.toFixed(2)} ${units[unitIndex]}`; //returns like 32.3 MB or B or GB or TB or PB or EB or ZB or YB
};

export const getFileType = (mimeType: string): string => {
  switch (mimeType.toLowerCase()) {
    // Documents
    case "application/pdf":
      return "pdf";
    case "application/msword":
    case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
      return "doc";
    case "application/vnd.ms-excel":
    case "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
      return "xls";
    case "application/vnd.ms-powerpoint":
    case "application/vnd.openxmlformats-officedocument.presentationml.presentation":
      return "ppt";

    // Images
    case "image/jpeg":
    case "image/jpg":
      return "jpg";
    case "image/png":
      return "png";
    case "image/gif":
      return "gif";
    case "image/svg+xml":
      return "svg";

    // Media
    case "video/mp4":
      return "mp4";
    case "audio/mpeg":
      return "mp3";
    case "audio/wav":
      return "wav";

    // Archives
    case "application/zip":
      return "zip";
    case "application/x-rar-compressed":
      return "rar";

    // Text
    case "text/plain":
      return "txt";
    case "text/html":
      return "html";
    case "text/css":
      return "css";
    case "application/json":
      return "json";

    default:
      // Convert to lowercase to be consistent
      return mimeType.split("/")[1]?.toLowerCase() || "unknown";
  }
};

export const getFileExtensionFromType = (type: string): string => {
  switch (type.toLowerCase()) {
    case "pdf":
      return ".pdf";
    case "doc":
    case "docx":
      return ".docx";
    case "xls":
    case "xlsx":
      return ".xlsx";
    case "ppt":
    case "pptx":
      return ".pptx";
    case "jpg":
    case "jpeg":
      return ".jpg";
    case "png":
      return ".png";
    default:
      return ".dat";
  }
};

export const getMimeTypeFromDocType = (type: string): string => {
  switch (type.toLowerCase()) {
    case "pdf":
      return "application/pdf";
    case "doc":
    case "docx":
      return "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
    case "xls":
    case "xlsx":
      return "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
    case "ppt":
    case "pptx":
      return "application/vnd.openxmlformats-officedocument.presentationml.presentation";
    case "jpg":
    case "jpeg":
      return "image/jpeg";
    case "png":
      return "image/png";
    default:
      return "application/octet-stream";
  }
};

export const DOCUMENT_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.ms-powerpoint",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  "image/jpeg",
  "image/png",
];

// New interfaces for document picker
export interface DocumentPickerOptions {
  multiple?: boolean;
  maxFiles?: number;
  currentCount?: number;
  types?: string[];
}

export interface DocumentResult {
  id: string;
  name: string;
  uri: string;
  size?: number;
  mimeType?: string;
  fileType?: string;
}

// Simple document picker that returns the original result
export const pickDocument = async (
  options?: DocumentPicker.DocumentPickerOptions
): Promise<{ data: null | DocumentPicker.DocumentPickerResult }> => {
  try {
    const result = await DocumentPicker.getDocumentAsync(options);
    return { data: result };
  } catch (error) {
    console.error("Document picking error:", error);
    Alert.alert("Error", "Error while picking document");
    return { data: null };
  }
};

// Main handler for document picking - similar to your image picker
const handleDocumentPicking = async (
  options: DocumentPickerOptions
): Promise<DocumentResult[] | null> => {
  // Default options
  const defaultOptions = {
    multiple: false,
    maxFiles: 10,
    currentCount: 0,
    types: DOCUMENT_TYPES,
  };

  const pickerOptions = { ...defaultOptions, ...options };
  const remainingSlots = pickerOptions.maxFiles
    ? pickerOptions.maxFiles - pickerOptions.currentCount
    : undefined;

  // Check if we've reached max files
  if (
    pickerOptions.multiple &&
    pickerOptions.maxFiles &&
    pickerOptions.currentCount >= pickerOptions.maxFiles
  ) {
    Alert.alert(
      "Maximum Files",
      `You can only upload up to ${pickerOptions.maxFiles} files.`
    );
    return null;
  }

  try {
    // Configure document picker options
    const documentOptions: DocumentPicker.DocumentPickerOptions = {
      type: pickerOptions.types,
      copyToCacheDirectory: true,
      multiple: pickerOptions.multiple,
      // Properly use the remaining slots to limit selection
      ...(pickerOptions.multiple &&
        remainingSlots && {
          // Some versions of Expo support this property
          selectionLimit: remainingSlots,
        }),
    };

    // Launch document picker
    const { data } = await pickDocument(documentOptions);

    if (data?.canceled || !data?.assets || data?.assets.length === 0) {
      return null;
    }

    // Parse results consistently
    return data.assets.map((asset, index) => {
      const fileType = getFileType(asset.mimeType || "");
      return {
        id: `doc_${Date.now()}_${index}`,
        name:
          asset.name ||
          `Document_${Date.now()}_${index}${getFileExtensionFromType(
            fileType
          )}`,
        uri: asset.uri,
        size: asset.size,
        mimeType: asset.mimeType,
        fileType: fileType,
      };
    });
  } catch (error: any) {
    console.error("Document selection error:", error);

    // Handle permission errors
    if (error.message && error.message.toLowerCase().includes("permission")) {
      Alert.alert("Permission Required", "Please allow access to your files.", [
        { text: "Cancel", style: "cancel" },
        { text: "Open Settings", onPress: () => Linking.openSettings() },
      ]);
    } else {
      Alert.alert("Error", "Failed to select document. Please try again.");
    }

    return null;
  }
};

// Select a single document
export const selectSingleDocument = async (
  options: DocumentPickerOptions = {}
): Promise<DocumentResult | null> => {
  const results = await handleDocumentPicking({
    ...options,
    multiple: false,
  });

  // Return the first item or null
  return results && results.length > 0 ? results[0] : null;
};

// Select multiple documents
export const selectMultipleDocuments = async (
  options: DocumentPickerOptions = {}
): Promise<DocumentResult[] | null> => {
  // Ensure multiple is true
  return handleDocumentPicking({
    ...options,
    multiple: true,
  });
};
