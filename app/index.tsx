import { useTheme } from "@/theme/ThemeProvider";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";


export default function Splash() {
  const router = useRouter();
  const { colors } = useTheme();

  useEffect(() => {
    setTimeout(() => {
      router.replace("/(tabs)/home");
    }, 3500);
  }, []);

  return (
    <SafeAreaProvider >

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
    </SafeAreaProvider>
  );
}
