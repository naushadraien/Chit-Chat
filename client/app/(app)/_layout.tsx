import { LoadingSpinner } from "@/components/atomic/Loader/LoadingSpinner";
import { SafeAreaWrapper } from "@/components/atomic/SafeAreaWrapper";
import { useCheckStartupCompletion } from "@/hooks/useCheckStartupCompletion";
import { useAuth } from "@/providers/AuthProvider";
import { Redirect, Stack } from "expo-router";
import { useEffect } from "react";
import "react-native-reanimated";

/**
 * Main stack navigator for the authenticated app experience
 */
const AppNavigator = () => (
  <Stack
    screenOptions={{
      headerShown: false,
      animation: "fade",
      contentStyle: { backgroundColor: "#FFFFFF" },
    }}
  >
    <Stack.Screen name="(tabs)" />
    {/* Add other main app screens here */}
  </Stack>
);

/**
 * Loading screen component to maintain consistent loading UI
 */
const LoadingScreen = () => (
  <SafeAreaWrapper style={{ alignItems: "center", justifyContent: "center" }}>
    <LoadingSpinner />
  </SafeAreaWrapper>
);

/**
 * Root layout component that manages authentication state
 * and routes to appropriate screens based on user state
 */
export default function RootLayout() {
  const { isLoading, authState } = useAuth();
  const { loading: startupLoading, isComplete: startupComplete } =
    useCheckStartupCompletion();

  // Handle initial loading state
  if (isLoading || startupLoading) {
    return <LoadingScreen />;
  }

  if (!startupComplete) {
    return <Redirect href="/start-up" />;
  }

  // Handle unauthenticated users
  if (!authState.authenticated) {
    return <Redirect href="/login" />;
  }

  // For authenticated users, proceed to verification and startup checks
  return <VerificationFlow />;
}

/**
 * Component that handles the verification flow for authenticated users
 * Checks user verification status before allowing access to main app
 */
function VerificationFlow() {
  const { userDetails, isLoading } = useAuth();

  // Handle startup loading state
  if (isLoading) {
    return <LoadingScreen />;
  }

  // Ensure we have user details before proceeding
  if (!userDetails) {
    console.warn(
      "Authentication anomaly: User is authenticated but details are missing"
    );
    return <Redirect href="/login" />;
  }

  // Check phone verification first (security)
  if (!userDetails.verificationStatus?.isPhoneVerified) {
    return <Redirect href="/verify-phone" />;
  }

  // Check profile completion (user experience)
  if (!userDetails.verificationStatus?.isNameProvided) {
    return <Redirect href="/complete-profile" />;
  }

  // All checks passed - proceed to main app
  return <AppNavigator />;
}
