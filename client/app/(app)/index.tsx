import { LoadingSpinner } from "@/components/atomic/Loader/LoadingSpinner";
import { SafeAreaWrapper } from "@/components/atomic/SafeAreaWrapper";
import { useCheckStartupCompletion } from "@/hooks/useCheckStartupCompletion";
import { useAuth } from "@/providers/AuthProvider";
import { Redirect } from "expo-router";

/**
 * Main stack navigator for authenticated app
 */
const AppNavigator = () => <Redirect href="/(app)/(tabs)" />;

/**
 * Loading screen
 */
const LoadingScreen = () => (
  <SafeAreaWrapper style={{ alignItems: "center", justifyContent: "center" }}>
    <LoadingSpinner />
  </SafeAreaWrapper>
);

/**
 * Root layout with improved auth flow
 */
export default function RootLayout() {
  const { isLoading, authState } = useAuth();
  const { loading: startupLoading, isComplete: startupComplete } =
    useCheckStartupCompletion();

  // Show loading during initial check
  if (isLoading || startupLoading) {
    return <LoadingScreen />;
  }

  // Handle startup flow for first-time users
  if (!startupComplete) {
    return <Redirect href="/start-up" />;
  }

  // Redirect to login if not authenticated
  if (!authState.authenticated) {
    return <Redirect href="/login" />;
  }

  // Verification flow for authenticated users
  return <VerificationFlow />;
}

/**
 * Verification flow component
 */
function VerificationFlow() {
  const { isLoading, userDetails } = useAuth();

  // Loading state during user data fetch
  if (isLoading) {
    return <LoadingScreen />;
  }

  // Ensure user details exist
  if (!userDetails) {
    return <Redirect href="/login" />;
  }

  // Check phone verification (security requirement)
  if (!userDetails.verificationStatus?.isPhoneVerified) {
    return <Redirect href="/verify-phone" />;
  }

  // Check profile completion (UX requirement)
  if (!userDetails.verificationStatus?.isNameProvided) {
    return <Redirect href="/complete-profile" />;
  }

  // All checks passed
  return <AppNavigator />;
}
