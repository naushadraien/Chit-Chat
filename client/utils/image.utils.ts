import { showToast } from "@/providers/ToastProvider";
import { ASPECT_RATIO } from "@/theme";
import * as ImagePicker from "expo-image-picker";
import * as Linking from "expo-linking";
import { Alert, Dimensions, Platform } from "react-native";

type ResponiveImageType = {
  orientation?: "landscape" | "portrait" | "square";
  decreaseWidthBy?: number;
  containerWidth?: number;
};

const { width } = Dimensions.get("window");

export function getResponsiveHeight(
  {
    orientation = "landscape",
    decreaseWidthBy = 0,
    containerWidth,
  }: ResponiveImageType = {
    orientation: "landscape",
    decreaseWidthBy: 0,
  }
) {
  const aspect = ASPECT_RATIO[orientation] ?? ASPECT_RATIO.portrait;

  if (containerWidth) {
    const imageHeight = containerWidth / aspect.ratio;

    return imageHeight;
  }

  const height = (width - decreaseWidthBy) / aspect.ratio;

  return height;
}

export async function pickImage(
  options?: ImagePicker.ImagePickerOptions
): Promise<{ data: null | ImagePicker.ImagePickerSuccessResult }> {
  try {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== "granted") {
      Alert.alert(
        "Sorry, we need media library permissions to make this work!"
      );
      return { data: null };
    }

    let result = await ImagePicker.launchImageLibraryAsync(options);

    if (!result.canceled) {
      return { data: result };
    }

    return { data: null };
  } catch (error) {
    showToast({
      type: "error",
      text1: "Image Picker Error",
      text2: "Error while picking image",
    });
    return { data: null };
  }
}

export interface BaseImagePickerOptions {
  width?: number;
  height?: number;
  aspect?: [number, number];
  quality?: number;
  cropping?: boolean;
  allowsEditing?: boolean;
}

// Single image picker result
export interface SingleImageResult {
  uri: string;
  width?: number;
  height?: number;
  fileSize?: number;
  type?: string;
  fileName?: string;
}

// Multiple image picker result
export interface MultipleImageResult {
  photoId: string;
  photoUrl: string;
}

const handleImagePicking = async <T>(
  options: BaseImagePickerOptions & {
    multiple?: boolean;
    maxImages?: number;
    currentCount?: number;
  },
  // Parsers for different formats (single vs multiple)
  parsers: {
    parseAndroidResult: (
      result: ImagePicker.ImagePickerSuccessResult
    ) => T | null;
    parseIosResult: (result: any) => T | null;
  }
): Promise<T | null> => {
  // Default options
  const defaultOptions = {
    width: 1600,
    height: 900,
    aspect: [ASPECT_RATIO.landscape.x, ASPECT_RATIO.landscape.y],
    allowsEditing: true,
    quality: 1,
    cropping: true,
    multiple: false,
    currentCount: 0,
  };

  const pickerOptions = { ...defaultOptions, ...options };
  const remainingSlots = pickerOptions.maxImages
    ? pickerOptions.maxImages - pickerOptions.currentCount
    : undefined;

  // Check if we've reached max images
  if (
    pickerOptions.multiple &&
    pickerOptions.maxImages &&
    pickerOptions.currentCount >= pickerOptions.maxImages
  ) {
    Alert.alert(
      "Maximum Images",
      `You can only upload up to ${pickerOptions.maxImages} images.`
    );
    return null;
  }

  const expoOptions: ImagePicker.ImagePickerOptions = {
    mediaTypes: ["images"],
    allowsEditing: pickerOptions.allowsEditing,
    aspect: pickerOptions.aspect as BaseImagePickerOptions["aspect"],
    quality: pickerOptions.quality,
    allowsMultipleSelection: pickerOptions.multiple,
    ...(pickerOptions.multiple &&
      remainingSlots && { selectionLimit: remainingSlots }),
  };

  if (Platform.OS === "android") {
    // Check Android version
    const androidVersion = Platform.Version;

    // For Android 11 and below, directly launch the picker
    if (androidVersion <= 30) {
      try {
        // Directly launch the picker without permission check for Android 11 and below
        const result = await ImagePicker.launchImageLibraryAsync(expoOptions);
        if (!result.canceled && result.assets && result.assets.length > 0) {
          return parsers.parseAndroidResult(result);
        }
      } catch (error: any) {
        console.log("Android direct picker error:", error);

        // If the direct approach fails due to permission issues
        if (error.message && error.message.includes("permission")) {
          try {
            // Fall back to the permission-based approach
            const { data } = await pickImage(expoOptions);
            if (data && data.assets && data.assets.length > 0) {
              return parsers.parseAndroidResult(data);
            }
          } catch (fallbackError) {
            console.error("Fallback picker error:", fallbackError);
            throw new Error(
              "Failed to access image library. Please check app permissions."
            );
          }
        } else {
          throw error;
        }
      }
    } else {
      // Android 12+ - explicitly request permission first
      try {
        const { data } = await pickImage(expoOptions);
        if (data && data.assets && data.assets.length > 0) {
          return parsers.parseAndroidResult(data);
        }
      } catch (error) {
        console.error("Android 12+ picker error:", error);
        throw new Error(
          "Failed to access image library on Android 12+. Please check app permissions."
        );
      }
    }
  } else if (Platform.OS === "ios") {
    try {
      const { data } = await pickImage(expoOptions);
      if (data && data.assets && data.assets.length > 0) {
        return parsers.parseIosResult(data);
      }
    } catch (error: any) {
      console.log("iOS picker error:", error);
      if (error.code === "E_PERMISSION_MISSING") {
        Alert.alert(
          "Permission Required",
          "Please allow access to your photo library in Settings.",
          [
            { text: "Cancel", style: "cancel" },
            { text: "Open Settings", onPress: () => Linking.openSettings() },
          ]
        );
      }
      throw error;
    }
  }

  // If we get here, either the user canceled or something went wrong
  return null;
};

export const selectSingleImage = async (
  options: BaseImagePickerOptions = {}
): Promise<SingleImageResult | null> => {
  return handleImagePicking<SingleImageResult>(
    { ...options, multiple: false },
    {
      parseAndroidResult: (result) => {
        if (result.assets && result.assets[0]) {
          return {
            uri: result.assets[0].uri,
            width: result.assets[0].width,
            height: result.assets[0].height,
            type: result.assets[0].type,
            fileName: result.assets[0].fileName || `image-${Date.now()}.jpg`,
          };
        }
        return null;
      },
      parseIosResult: (result) => {
        if (result && result.path) {
          return {
            uri: result.path,
            width: result.width,
            height: result.height,
            fileSize: result.size,
            type: result.mime,
            fileName: result.filename || `image-${Date.now()}.jpg`,
          };
        }
        return null;
      },
    }
  );
};

export const selectMultipleImages = async (
  options: BaseImagePickerOptions & {
    maxImages?: number;
    currentCount?: number;
  } = {}
): Promise<MultipleImageResult[] | null> => {
  return handleImagePicking<MultipleImageResult[]>(
    { ...options, multiple: true },
    {
      parseAndroidResult: (result) => {
        if (result.assets && result.assets.length > 0) {
          return result.assets.map((asset, idx) => ({
            photoId: `local_${Date.now()}_${idx}`,
            photoUrl: asset.uri,
          }));
        }
        return null;
      },
      parseIosResult: (results) => {
        if (Array.isArray(results) && results.length > 0) {
          return results.map((img, idx) => ({
            photoId: `local_${Date.now()}_${idx}`,
            photoUrl: img.path,
          }));
        }
        return null;
      },
    }
  );
};
