import { useEffect, useRef, useState } from "react";
import { AppState, AppStateStatus } from "react-native";

export const useAppCurrentState = () => {
  const [currentAppState, setCurrentAppState] = useState<AppStateStatus>(
    AppState.currentState
  );
  const previousAppState = useRef<AppStateStatus>(AppState.currentState);
  const backgroundTime = useRef<number | null>(null);
  const [backgroundDuration, setBackgroundDuration] = useState<number | null>(
    null
  );

  const handleAppStateChange = (nextAppState: AppStateStatus) => {
    const prevState = previousAppState.current;

    console.log(`📱 App state: ${prevState} -> ${nextAppState}`);

    if (nextAppState === "background") {
      backgroundTime.current = Date.now();
      console.log("⏱️ App went to background");
      setBackgroundDuration(null);
    } else if (nextAppState === "active" && backgroundTime.current) {
      const duration = Date.now() - backgroundTime.current;
      console.log(
        `⏱️ App was in background for: ${Math.floor(duration / 1000)}s`
      );
      setBackgroundDuration(duration);
      backgroundTime.current = null;
    }

    previousAppState.current = nextAppState;
    setCurrentAppState(nextAppState);
  };

  useEffect(() => {
    const subscription = AppState.addEventListener(
      "change",
      handleAppStateChange
    );

    return () => {
      subscription.remove();
    };
  }, []);

  return {
    appState: currentAppState,
    previousAppState: previousAppState.current,
    isActive: currentAppState === "active",
    isBackground: currentAppState === "background",
    isInactive: currentAppState === "inactive",
    backgroundDuration,
    backgroundDurationMs: backgroundDuration,
    backgroundDurationSec: backgroundDuration
      ? Math.floor(backgroundDuration / 1000)
      : null,
    isLongBackground: backgroundDuration ? backgroundDuration > 30000 : false,
  };
};
