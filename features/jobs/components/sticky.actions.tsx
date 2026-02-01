import { useTheme } from "@/theme/ThemeProvider";
import { Pressable, Text, View } from "react-native";

export function StickyActions() {
  const theme = useTheme();

  return (
    <View
      style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        padding: theme.spacing[4],
        backgroundColor: theme.colors.surface,
      }}
    >
      <Pressable
        style={{
          backgroundColor: theme.colors.primaryLight,
          paddingVertical: theme.spacing[3],
          borderRadius: theme.radius.lg,
          alignItems: "center",
          marginBottom: theme.spacing[3],
        }}
      >
        <Text style={{ color: theme.colors.primary, fontWeight: "600" }}>
          Download Receipt
        </Text>
      </Pressable>

      <Pressable
        style={{
          backgroundColor: theme.colors.primary,
          paddingVertical: theme.spacing[4],
          borderRadius: theme.radius.lg,
          alignItems: "center",
        }}
      >
        <Text style={{ color: "#fff", fontWeight: "700" }}>
          Rebook Artisan
        </Text>
      </Pressable>

      <Text
        style={{
          marginTop: theme.spacing[3],
          textAlign: "center",
          color: theme.colors.textMuted,
        }}
      >
        Need help with this job?
      </Text>
    </View>
  );
}
