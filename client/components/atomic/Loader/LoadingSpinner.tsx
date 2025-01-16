import { ActivityIndicator, View } from "react-native";
import { Divider } from "../Divider";
import { Typography } from "../Typography";
import { COLORS } from "@/theme";

export function LoadingSpinner() {
  return <ActivityIndicator size="large" color={COLORS.PRIMARYBLUE} />;
}

export function NoContent({ title = "Data" }: { title?: string }) {
  return (
    <Typography style={{ textAlign: "center", color: COLORS.GREY600 }}>
      No {title} Found.{" "}
    </Typography>
  );
}

export function LoaderForFlatListInnerItem({
  loading,
  isEmpty,
  title,
}: {
  loading: boolean;
  isEmpty: boolean;
  title?: string;
}) {
  return loading ? (
    <View>
      <Divider height={24} width={24} />
      <LoadingSpinner />
    </View>
  ) : isEmpty ? (
    <View>
      <Divider height={24} width={24} />

      <NoContent title={title} />
    </View>
  ) : null;
}
