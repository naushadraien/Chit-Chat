import { SafeAreaWrapper } from "@/components/atomic/SafeAreaWrapper";
import { SvgIcon } from "@/components/atomic/SvgIcon";
import { Typography } from "@/components/atomic/Typography";
import { InputField } from "@/components/new-atomic/Input";
import { WithBackBTN } from "@/Layout/Header/WithBackBTN";
import { PhoneDataType, phoneSchema } from "@/schema/phone.schema";
import { SPACINGS } from "@/theme";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { Text, View } from "react-native";

export default function VerifyPhone() {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<PhoneDataType>({
    resolver: zodResolver(phoneSchema),
    defaultValues: {
      phoneNumber: "",
    },
  });
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
              <InputField
                value={value}
                placeholder="Phone Number"
                autoFocus
                onChangeText={onChange}
                error={errors.phoneNumber?.message}
                autoCapitalize="none"
                keyboardType="number-pad"
              />
            )}
          />
        </View>
      </View>
    </SafeAreaWrapper>
  );
}
