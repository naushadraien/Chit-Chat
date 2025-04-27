import { showToast } from "@/providers/ToastProvider";
import * as ImagePicker from "expo-image-picker";
import { Alert } from "react-native";

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
