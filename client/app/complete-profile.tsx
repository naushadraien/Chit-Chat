import { FilledButton } from "@/components/atomic/Button/FilledButton";
import { SafeAreaWrapper } from "@/components/atomic/SafeAreaWrapper";
import ErrorComponent from "@/components/new-atomic/ErrorComponent";
import { InputField } from "@/components/new-atomic/Input";
import ProfilePicUpload from "@/components/new-atomic/ProfilePicUpload";
import { WithTitle } from "@/Layout/Header/WithTitle";
import {
  CompleteProfileDataType,
  completeProfileSchema,
} from "@/schema/complete-profile.schema";
import { SPACINGS } from "@/theme";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { Text, View } from "react-native";

export default function CompleteProfile() {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<CompleteProfileDataType>({
    resolver: zodResolver(completeProfileSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      profileImage: "",
    },
  });
  console.log("🚀 ~ CompleteProfile ~ errors:", errors);

  const onSubmit = (data: CompleteProfileDataType) => {
    console.log("🚀 ~ onSubmit ~ data:", data);
  };

  return (
    <SafeAreaWrapper>
      <View
        style={{
          paddingHorizontal: SPACINGS.LG,
          flex: 1,
        }}
      >
        <WithTitle title="Your Profile" />
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            flex: 1,
          }}
        >
          <Controller
            control={control}
            name="profileImage"
            render={({ field: { onChange, value } }) => {
              return (
                <View>
                  <ProfilePicUpload
                    imgUri={value}
                    onImagePick={(imgUri) => onChange(imgUri)}
                  />
                  <ErrorComponent error={errors?.profileImage?.message || ""} />
                </View>
              );
            }}
          />
          <Controller
            control={control}
            name="firstName"
            render={({ field: { onChange, value } }) => {
              return (
                <InputField
                  onChangeText={onChange}
                  value={value}
                  placeholder="First Name (Required)"
                  mainContainerStyle={{
                    marginTop: 31,
                  }}
                  error={errors.firstName?.message}
                />
              );
            }}
          />
          <Controller
            control={control}
            name="lastName"
            render={({ field: { onChange } }) => {
              return (
                <InputField
                  onChangeText={onChange}
                  placeholder="Last Name (Required)"
                  error={errors.lastName?.message}
                />
              );
            }}
          />
          <FilledButton
            title="Save"
            onPress={handleSubmit(onSubmit)}
            fullWidth
            style={{
              marginTop: 68,
            }}
          />
        </View>
      </View>
    </SafeAreaWrapper>
  );
}
