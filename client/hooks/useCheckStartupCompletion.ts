import { STARTUP_COMPLETED } from "@/constants/AsyncStorage";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";

export function useCheckStartupCompletion() {
  const [loading, setLoading] = useState(true);
  const [isComplete, setIsComplete] = useState(false);

  const checkStartupCompleted = async () => {
    try {
      const startupStatus = await AsyncStorage.getItem(STARTUP_COMPLETED);
      if (startupStatus && startupStatus === "completed") {
        setIsComplete(true);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkStartupCompleted();
  }, []);

  return { loading, isComplete };
}
