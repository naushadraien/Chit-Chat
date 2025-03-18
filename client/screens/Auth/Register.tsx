import { authApi } from "@/api/auth";
import { FilledButton } from "@/components/atomic/Button/FilledButton";
import { Loader } from "@/components/atomic/Loader";
import { SafeAreaWrapper } from "@/components/atomic/SafeAreaWrapper";
import { SvgIcon } from "@/components/atomic/SvgIcon";
import { Typography } from "@/components/atomic/Typography";
import { InputField } from "@/components/new-atomic/Input";
import { useToast } from "@/providers/ToastProvider";
import registerSchema, { RegisterFormData } from "@/schema/register.schema";
import { COLORS, FONTFAMILIES } from "@/theme";
import requestAPI from "@/utils/apiRequest/requestApi";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { router } from "expo-router";
import React, { useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Pressable, Text, TextInput, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

const RegisterScreen = () => {
  console.log("RegisterScreen rendering");
  const [isPressedEyeBtn, setIsPressedEyeBtn] = useState<{
    isPasswordField: boolean;
    isConfirmPasswordField: boolean;
  }>({
    isConfirmPasswordField: false,
    isPasswordField: false,
  });
  const refs = useRef<TextInput[]>([]).current;
  const { showToast } = useToast();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const { mutate: signUp, isPending } = useMutation({
    mutationFn: async (data: RegisterFormData) => {
      return await requestAPI(authApi.signUp(data));
    },
    onSuccess: (data) => {
      console.log("🚀 ~ RegisterScreen ~ data:", data);
      router.replace("/login");
      showToast({
        type: "success",
        text1: "Registered successfully!",
      });
    },
  });

  const onSubmit = (data: RegisterFormData) => {
    signUp(data);
  };

  const handlePressEyeBtn = (
    key: keyof typeof isPressedEyeBtn,
    value: boolean
  ) => {
    setIsPressedEyeBtn((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  return (
    <SafeAreaWrapper statusBarStyle="dark" backgroundColor="WHITE">
      <KeyboardAwareScrollView
        contentContainerStyle={{
          paddingHorizontal: 19,
          justifyContent: "space-between",
          paddingBottom: 10,
          paddingTop: 40,
          backgroundColor: "white",
          flexGrow: 1,
        }}
        showsVerticalScrollIndicator={false}
        enableOnAndroid
      >
        <View>
          <View
            style={{
              gap: 12,
            }}
          >
            <Typography
              fontFamily="MULISH_BOLD"
              color="PRIMARYBLUE"
              fontSize="XL"
              style={{
                lineHeight: 30,
              }}
            >
              Create an Account
            </Typography>
            <Typography
              fontFamily="MULISH_MEDIUM"
              fontSize="LG"
              style={{
                lineHeight: 24,
              }}
              color="GREY800"
            >
              Join us and get started today !
            </Typography>
          </View>

          <View>
            <View
              style={{
                gap: 14,
                marginTop: 50,
              }}
            >
              <Controller
                control={control}
                name="email"
                render={({ field: { onChange, value } }) => (
                  <InputField
                    value={value}
                    label="Email"
                    placeholder="Email"
                    autoFocus
                    rightIcon={
                      <SvgIcon name="email-icon" size={22} fill={"GREY500"} />
                    }
                    onChangeText={onChange}
                    error={errors.email?.message}
                    returnKeyType="next"
                    ref={(el) => (refs[0] = el!)}
                    onSubmitEditing={() => refs[1]?.focus()}
                    autoCapitalize="none"
                    keyboardType="email-address"
                  />
                )}
              />

              <Controller
                control={control}
                name="password"
                render={({ field: { onChange, value } }) => (
                  <InputField
                    value={value}
                    label="Password"
                    placeholder="Password"
                    rightIcon={
                      <Pressable
                        onPress={() =>
                          handlePressEyeBtn(
                            "isPasswordField",
                            !isPressedEyeBtn.isPasswordField
                          )
                        }
                      >
                        <SvgIcon
                          name={
                            isPressedEyeBtn.isPasswordField
                              ? "eye-open-icon"
                              : "eye-close-icon"
                          }
                          size={22}
                          fill={"GREY500"}
                        />
                      </Pressable>
                    }
                    onChangeText={onChange}
                    error={errors.password?.message}
                    secureTextEntry={!isPressedEyeBtn.isPasswordField}
                    returnKeyType="next"
                    ref={(el) => (refs[1] = el!)}
                    onSubmitEditing={() => refs[2]?.focus()}
                    autoCapitalize="none"
                  />
                )}
              />
              <Controller
                control={control}
                name="confirmPassword"
                render={({ field: { onChange, value } }) => (
                  <InputField
                    value={value}
                    label="Confirm Password"
                    placeholder="Confirm Password"
                    rightIcon={
                      <Pressable
                        onPress={() =>
                          handlePressEyeBtn(
                            "isConfirmPasswordField",
                            !isPressedEyeBtn.isConfirmPasswordField
                          )
                        }
                      >
                        <SvgIcon
                          name={
                            isPressedEyeBtn.isConfirmPasswordField
                              ? "eye-open-icon"
                              : "eye-close-icon"
                          }
                          size={22}
                          fill={"GREY500"}
                        />
                      </Pressable>
                    }
                    onChangeText={onChange}
                    error={errors.confirmPassword?.message}
                    secureTextEntry={!isPressedEyeBtn.isConfirmPasswordField}
                    returnKeyType="next"
                    ref={(el) => (refs[2] = el!)}
                    onSubmitEditing={() => refs[3]?.focus()}
                    autoCapitalize="none"
                  />
                )}
              />
            </View>

            <View
              style={{
                gap: 12,
                alignItems: "center",
                marginTop: 80,
              }}
            >
              <FilledButton
                title="Register"
                onPress={handleSubmit(onSubmit)}
                fullWidth
              />
              <View style={{ flexDirection: "row", gap: 8 }}>
                <Typography
                  fontFamily="MULISH_MEDIUM"
                  fontSize="LG"
                  color="GREY700"
                  style={{
                    lineHeight: 24,
                  }}
                >
                  Already Member ?
                </Typography>
                <Pressable onPress={() => router.push("/login")}>
                  <Typography
                    fontFamily="MULISH_MEDIUM"
                    fontSize="LG"
                    color="PRIMARYBLUE"
                    style={{
                      lineHeight: 24,
                    }}
                  >
                    SIGN IN
                  </Typography>
                </Pressable>
              </View>
            </View>
          </View>
        </View>
        <View
          style={{
            alignSelf: "center",
          }}
        >
          <Text
            style={{
              color: COLORS.GREY700,
              fontSize: 14,
              fontFamily: FONTFAMILIES.MULISH_MEDIUM,
              lineHeight: 16.8,
              fontWeight: "500",
            }}
          >
            Privacy Policy{" "}
            <Text
              style={{
                color: COLORS.PRIMARY200,
                fontWeight: "bold",
              }}
            >
              •
            </Text>{" "}
            Terms of Service
          </Text>
        </View>
      </KeyboardAwareScrollView>
      <Loader loading={isPending} />
    </SafeAreaWrapper>
  );
};

export default RegisterScreen;
