import { useSafeAreaInsets } from "react-native-safe-area-context";

export const MIN_INSET_BOTTOM = 10;

export const useCustomSafeInsets = () => {
  const insets = useSafeAreaInsets();
  //For devices with zero bottom inset
  const bottom = insets.bottom == 0 ? MIN_INSET_BOTTOM : insets.bottom;

  return {
    top: insets.top,
    bottom,
  };
};
