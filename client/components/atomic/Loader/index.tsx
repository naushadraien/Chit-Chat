import { FC } from "react";
import { View, Modal, ActivityIndicator } from "react-native";
import { Typography } from "../Typography";
import { RADII, SPACINGS } from "@/theme";

type LoaderProps = {
  loading: boolean;
  msg?: string;
};

export const Loader: FC<LoaderProps> = ({ loading, msg }) => {
  return (
    <Modal transparent={true} animationType={"none"} visible={loading}>
      <View
        style={{
          flex: 1,
          backgroundColor: "#00000040",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <View
          style={{
            backgroundColor: "#FFFFFF",
            borderRadius: RADII.LG,
            alignItems: "center",
            justifyContent: "center",
            padding: SPACINGS.LG,
            gap: SPACINGS.SM,
          }}
        >
          <ActivityIndicator animating={loading} size={"large"} />
          {msg && <Typography fontSize="SM">{msg}</Typography>}
        </View>
      </View>
    </Modal>
  );
};
