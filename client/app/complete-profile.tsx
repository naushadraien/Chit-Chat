import { userApi } from "@/api/user";
import { FilledButton } from "@/components/atomic/Button/FilledButton";
import { Loader } from "@/components/atomic/Loader";
import { SafeAreaWrapper } from "@/components/atomic/SafeAreaWrapper";
import ErrorComponent from "@/components/new-atomic/ErrorComponent";
import { InputField } from "@/components/new-atomic/Input";
import ProfilePicUpload from "@/components/new-atomic/ProfilePicUpload";
import { WithTitle } from "@/Layout/Header/WithTitle";
import { useAuth } from "@/providers/AuthProvider";
import {
  CompleteProfileDataType,
  completeProfileSchema,
} from "@/schema/complete-profile.schema";
import { SPACINGS } from "@/theme";
import requestAPI from "@/utils/apiRequest/requestApi";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { router } from "expo-router";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { View } from "react-native";

export default function CompleteProfile() {
  const { userDetails, updateUserDetails } = useAuth();

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<CompleteProfileDataType>({
    resolver: zodResolver(completeProfileSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      profileImage: "",
    },
  });

  const { mutate: updateAvatar, isPending: isUploadingAvatar } = useMutation({
    mutationFn: async ({ imgUri }: { imgUri: string }) => {
      const formData = new FormData();
      formData.append("file", {
        uri: imgUri,
        name: `image-${Date.now()}.jpg`,
        type: "image/jpeg",
      } as any);
      const response = await requestAPI(
        userApi.updateAvatar({
          data: formData,
          userId: userDetails?.id || "",
        })
      );
      return response;
    },
    onSuccess: async (data) => {
      await updateUserDetails?.(data);
      setValue("profileImage", data.avatar);
    },
  });

  const { mutate: updateUserData, isPending: isUpdatingProfile } = useMutation({
    mutationFn: async (data: { firstName: string; lastName: string }) => {
      const response = await requestAPI(
        userApi.updateUserData({
          data,
          userId: userDetails?.id || "",
        })
      );
      console.log("🚀 ~ mutationFn: ~ response:", response);
      return response;
    },
    onSuccess: async (data) => {
      await updateUserDetails?.(data);
      router.replace("/(app)");
    },
  });

  const onSubmit = ({ firstName, lastName }: CompleteProfileDataType) => {
    updateUserData({
      firstName,
      lastName,
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
            render={({ field: { value } }) => {
              return (
                <View>
                  <ProfilePicUpload
                    imgUri={value || userDetails?.avatar || ""}
                    onImagePick={(imgUri) =>
                      updateAvatar({
                        imgUri,
                      })
                    }
                    isUploading={isUploadingAvatar}
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
      <Loader loading={isUpdatingProfile} />
    </SafeAreaWrapper>
  );
}
