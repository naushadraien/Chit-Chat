import { FilledButton } from "@/components/atomic/Button/FilledButton";
import { Loader } from "@/components/atomic/Loader";
import { SafeAreaWrapper } from "@/components/atomic/SafeAreaWrapper";
import { SvgIcon } from "@/components/atomic/SvgIcon";
import { Typography } from "@/components/atomic/Typography";
import { InputField } from "@/components/new-atomic/Input";
import loginSchema, { LoginFormData } from "@/schema/login.schema";
import { COLORS, FONTFAMILIES } from "@/theme";
import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "expo-router";
import React, { useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Pressable, Text, TextInput, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

const LoginScreen = () => {
  // const { onLogin, isLoading } = useAuth();
  const refs = useRef<TextInput[]>([]).current;

  const [isPressedEyeBtn, setIsPressedEyeBtn] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  console.log("🚀 ~ Login ~ errors:", errors);

  const onSubmit = (data: LoginFormData) => {
    console.log("🚀 ~ onSubmit ~ data:", data);
  };

  const handlePressEyeBtn = () => {
    setIsPressedEyeBtn(!isPressedEyeBtn);
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
              Welcome Back !
            </Typography>
            <Typography
              fontFamily="MULISH_MEDIUM"
              fontSize="LG"
              style={{
                lineHeight: 24,
              }}
              color="GREY800"
            >
              Login to continue managing your experience effortlessly.
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
                    autoCapitalize="none"
                    autoFocus
                    rightIcon={
                      <SvgIcon name="email-icon" size={22} fill={"GREY500"} />
                    }
                    onChangeText={onChange}
                    error={errors.email?.message}
                    returnKeyType="next"
                    ref={(el) => (refs[0] = el!)}
                    onSubmitEditing={() => refs[1]?.focus()}
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
                    autoCapitalize="none"
                    rightIcon={
                      <Pressable onPress={handlePressEyeBtn}>
                        <SvgIcon
                          name={
                            isPressedEyeBtn ? "eye-open-icon" : "eye-close-icon"
                          }
                          size={22}
                          fill={"GREY500"}
                        />
                      </Pressable>
                    }
                    onChangeText={onChange}
                    error={errors.password?.message}
                    secureTextEntry={!isPressedEyeBtn}
                    ref={(el) => (refs[1] = el!)}
                  />
                )}
              />
              <Pressable
                onPress={() => router.push("/forgot-password")}
                style={{
                  alignSelf: "flex-end",
                }}
              >
                <Typography
                  fontFamily="MULISH_MEDIUM"
                  fontSize="LG"
                  style={{
                    lineHeight: 24,
                  }}
                  color="PRIMARYBLUE"
                >
                  Forgot Password?
                </Typography>
              </Pressable>
            </View>

            <View
              style={{
                gap: 12,
                alignItems: "center",
                marginTop: 80,
              }}
            >
              <FilledButton
                title="Sign In"
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
                  Don’t have an account ?
                </Typography>
                <Pressable onPress={() => router.push("/register")}>
                  <Typography
                    fontFamily="MULISH_MEDIUM"
                    fontSize="LG"
                    color="PRIMARYBLUE"
                    style={{
                      lineHeight: 24,
                    }}
                  >
                    REGISTER
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
      <Loader loading={false} />
    </SafeAreaWrapper>
  );
};

export default LoginScreen;
