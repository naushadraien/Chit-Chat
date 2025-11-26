import { COLORS } from "@/theme";
import { ActivityIndicator, View } from "react-native";
import { Divider } from "../Divider";
import { Typography } from "../Typography";

export function LoadingSpinner({
  size = "large",
}: {
  size?: number | "small" | "large" | undefined;
}) {
  return <ActivityIndicator size={size} color={COLORS.PRIMARYBLUE} />;
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
