import { useTheme } from "@/theme/useTheme";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Pressable, Text, View } from "react-native";

export function ReferCard() {
    const { colors, spacing, radius, typography, shadow } = useTheme();
    const router = useRouter();

    return (
        <Pressable
            onPress={() => router.push("/refer")}
            style={({ pressed }) => ({
                backgroundColor: colors.primaryDark,
                borderRadius: radius.xl,
                padding: spacing[5],
                marginTop: spacing[4],
                overflow: "hidden",
                opacity: pressed ? 0.94 : 1,
                ...shadow.md,
            })}
        >
            <View
                style={{
                    position: "absolute",
                    right: -20,
                    top: -20,
                    width: 120,
                    height: 120,
                    borderRadius: 60,
                    backgroundColor: "rgba(255,255,255,0.06)",
                }}
            />
            <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                <View
                    style={{
                        width: 40,
                        height: 40,
                        borderRadius: 20,
                        backgroundColor: colors.accent,
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <Ionicons name="gift" size={18} color="#fff" />
                </View>
                <Text style={{ ...typography.overline, color: colors.accent }}>
                    Invite & earn
                </Text>
            </View>
            <Text
                style={{
                    ...typography.h2,
                    color: "#fff",
                    marginTop: spacing[3],
                    marginBottom: spacing[2],
                }}
            >
                Refer a friend
            </Text>
            <Text
                style={{
                    ...typography.body,
                    color: "rgba(255,255,255,0.82)",
                }}
            >
                You both get ₦2,000 off your next repair when they complete a job.
            </Text>
            <View
                style={{
                    marginTop: spacing[4],
                    alignSelf: "flex-start",
                    backgroundColor: "#fff",
                    paddingHorizontal: spacing[4],
                    paddingVertical: spacing[2],
                    borderRadius: radius.full,
                }}
            >
                <Text style={{ ...typography.captionMedium, color: colors.primaryDark }}>
                    Share invite code
                </Text>
            </View>
        </Pressable>
    );
}
