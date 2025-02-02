import { LoadingSpinner } from "@/components/atomic/Loader/LoadingSpinner";
import { SafeAreaWrapper } from "@/components/atomic/SafeAreaWrapper";
import { useCheckStartupCompletion } from "@/hooks/useCheckStartupCompletion";
import { Redirect, Stack } from "expo-router";
import "react-native-reanimated";

const StackLayout = () => {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
    </Stack>
  );
};

export default function RootLayout() {
  // const { isLoading, authState } = useAuth();
  const isLoading = false;
  const authState = {
    authenticated: false,
  };

  // First check if app is loading auth state
  if (isLoading) {
    return (
      <SafeAreaWrapper
        style={{ alignItems: "center", justifyContent: "center" }}
      >
        <LoadingSpinner />
      </SafeAreaWrapper>
    );
  }

  // If not authenticated, redirect to login
  if (!authState.authenticated) {
    return <Redirect href="/login" />;
  }

  // If authenticated, check startup completion
  return <CheckStartup />;
}

function CheckStartup() {
  const { loading, isComplete } = useCheckStartupCompletion();

  if (!loading && !isComplete) {
    return <Redirect href="/start-up" />;
  }

  if (!loading && isComplete) {
    return <StackLayout />;
  }

  return (
    <SafeAreaWrapper style={{ alignItems: "center", justifyContent: "center" }}>
      <LoadingSpinner />
    </SafeAreaWrapper>
  );
}
