import { authApi } from "@/api/auth";
import { FilledButton } from "@/components/atomic/Button/FilledButton";
import { Loader } from "@/components/atomic/Loader";
import { SafeAreaWrapper } from "@/components/atomic/SafeAreaWrapper";
import { Typography } from "@/components/atomic/Typography";
import CodeInput from "@/components/new-atomic/CodeInput";
import CustomCountryPicker from "@/components/new-atomic/CustomCountryPicker";
import { ViewFullScreenModal } from "@/components/new-atomic/Modal/ViewFullScreenModal";
import { WithBackBTN } from "@/Layout/Header/WithBackBTN";
import { useAuth } from "@/providers/AuthProvider";
import { useToast } from "@/providers/ToastProvider";
import {
  PhoneDataType,
  phoneSchema,
  VerifyCodeDataType,
  verifyCodeSchema,
} from "@/schema/phone.schema";
import { SPACINGS } from "@/theme";
import requestAPI from "@/utils/apiRequest/requestApi";
import { extractPhoneParts } from "@/utils/textHelpers";
import { zodResolver } from "@hookform/resolvers/zod";
import { UseMutateFunction, useMutation } from "@tanstack/react-query";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { View } from "react-native";

export default function VerifyPhone() {
  const [codeSentRes, setCodeSentRes] = useState<
    | {
        otp: number;
        phoneNumber: string;
      }
    | undefined
  >();

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<PhoneDataType>({
    resolver: zodResolver(phoneSchema),
    defaultValues: {
      phoneNumber: "",
      countryCode: "+977",
    },
  });

  const { showToast } = useToast();
  const { updateUserDetails } = useAuth();

  const countryCode = watch("countryCode");

  const { mutate: sendOtp, isPending: isCodeSending } = useMutation({
    mutationFn: async (data: { phoneNumber: string }) => {
      const response = await requestAPI<typeof codeSentRes>(
        authApi.sendOtp(data)
      );
      return response;
    },
    onSuccess: async (data) => {
      await updateUserDetails?.({
        phoneNumber: data?.phoneNumber || "",
      });
      setCodeSentRes(data);
      showToast({
        type: "success",
        text1: "Success",
        text2: "Otp Send successfully",
      });
    },
  });
  const { mutate: verifyOtp, isPending: isVerifyingCode } = useMutation({
    mutationFn: async (data: { otp: string }) => {
      const response = await requestAPI(authApi.verifyOtp(data));
      return response;
    },
    onSuccess: async (data) => {
      await updateUserDetails?.({
        verificationStatus: {
          isPhoneVerified: data.verificationStatus.isPhoneVerified,
        },
      });
      showToast({
        type: "success",
        text1: "Success",
        text2: "Otp verified successfully",
      });
      router.replace("/complete-profile");
    },
    onError: (error) => {
      console.log("🚀 ~ VerifyPhone ~ error:", error);
    },
  });

  const onSubmit = (data: PhoneDataType) => {
    sendOtp({
      phoneNumber: data.countryCode + data.phoneNumber,
    });
  };

  const handleResendCode = () => {
    sendOtp({
      phoneNumber: codeSentRes?.phoneNumber || "",
    });
  };

  return (
    <SafeAreaWrapper>
      <View
        style={{
          paddingHorizontal: SPACINGS.LG,
          flex: 1,
        }}
      >
        <WithBackBTN />
        <View
          style={{
            justifyContent: "center",
            gap: 5,
            flex: 1,
          }}
        >
          <Typography fontFamily="MULISH_BOLD" fontSize="DISPLAY4">
            Enter Your Phone Number
          </Typography>
          <Typography
            fontFamily="MULISH_REGULAR"
            fontSize="SM"
            textAlign="center"
          >
            Please confirm your country code and enter your phone number
          </Typography>

          <Controller
            control={control}
            name="phoneNumber"
            render={({ field: { onChange, value } }) => (
              <CustomCountryPicker
                defaultCountryCode={countryCode}
                onCountryCodeChange={(code) => setValue("countryCode", code)}
                onPhoneNumberChange={onChange}
                defaultPhoneNumber={value}
                error={errors.phoneNumber?.message}
              />
            )}
          />
          <FilledButton
            onPress={handleSubmit(onSubmit)}
            title="Continue"
            style={{
              marginTop: 81,
            }}
          />
        </View>
      </View>
      <ViewFullScreenModal
        visible={!!codeSentRes}
        onClose={() => setCodeSentRes(undefined)}
      >
        <VerifyCodeComp
          formattedPhoneNumber={
            extractPhoneParts(codeSentRes?.phoneNumber || "").formatted
          }
          onResendCode={handleResendCode}
          onVerifyCode={verifyOtp}
        />
      </ViewFullScreenModal>

      <Loader loading={isCodeSending || isVerifyingCode} />
    </SafeAreaWrapper>
  );
}

function VerifyCodeComp({
  formattedPhoneNumber,
  onResendCode,
  onVerifyCode,
}: {
  formattedPhoneNumber: string;
  onResendCode?: VoidFunction;
  onVerifyCode?: UseMutateFunction<
    any,
    Error,
    {
      otp: string;
    },
    unknown
  >;
}) {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<VerifyCodeDataType>({
    resolver: zodResolver(verifyCodeSchema),
    defaultValues: {
      code: "",
    },
  });

  const [timeLeft, setTimeLeft] = useState(60);
  const [canResend, setCanResend] = useState(false);

  const handleResend = () => {
    onResendCode?.();
    setTimeLeft(60);
    setCanResend(false);
  };

  // Timer effect
  useEffect(() => {
    // Skip if timer has finished
    if (timeLeft <= 0) {
      setCanResend(true);
      return;
    }

    // Set up the interval
    const timerInterval = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);

    // Clean up on unmount or when timeLeft changes
    return () => clearInterval(timerInterval);
  }, [timeLeft]);

  // Format seconds as "00:59" format
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const onSubmit = (data: VerifyCodeDataType) => {
    onVerifyCode?.({
      otp: data.code,
    });
  };

  return (
    <>
      <Typography fontSize="DISPLAY4" fontFamily="MULISH_BOLD">
        Enter Code
      </Typography>
      <Typography textAlign="center" fontSize="MD">
        We have sent you an SMS with the code to {formattedPhoneNumber}
      </Typography>

      <View style={{ marginTop: 48 }}>
        <Controller
          control={control}
          name="code"
          render={({ field: { onChange } }) => (
            <CodeInput
              handleCodeInput={onChange}
              inputCount={6}
              error={errors.code?.message}
              onSubmit={handleSubmit(onSubmit)}
            />
          )}
        />
      </View>

      {/* Timer display and resend button */}
      <View style={{ alignItems: "center", marginTop: 40 }}>
        {!canResend && (
          <Typography
            fontSize="SM"
            fontFamily="MULISH_REGULAR"
            color="GREY500"
            style={{ marginBottom: 8 }}
          >
            Resend code in {formatTime(timeLeft)}
          </Typography>
        )}

        <FilledButton
          bgColor="TRANSPARENT"
          title="Resend Code"
          textColor={canResend ? "BRANDCOLOR" : "GREY400"}
          disabled={!canResend}
          onPress={canResend ? handleResend : undefined}
          style={{
            marginTop: canResend ? 0 : 8,
            opacity: canResend ? 1 : 0.6,
          }}
        />
      </View>
    </>
  );
}
