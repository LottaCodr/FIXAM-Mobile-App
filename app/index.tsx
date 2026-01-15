import { View, Text, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { useTheme } from "@/theme/ThemeProvider";

export default function Splash() {
  const router = useRouter();
  const { colors } = useTheme();

  useEffect(() => {
    setTimeout(() => {
      router.replace("/(tabs)/home");
    }, 3500);
  }, []);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.primary,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Text style={{ color: "#FFF", fontSize: 28, fontWeight: "700" }}>
        FixAm
      </Text>
      <ActivityIndicator color="#FFF" style={{ marginTop: 16 }} />
    </View>
  );
}
