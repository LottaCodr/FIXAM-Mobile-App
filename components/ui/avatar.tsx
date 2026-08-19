import { useTheme } from "@/theme/useTheme";
import { Image, Text, View } from "react-native";

type Props = {
    uri?: string;
    name?: string;
    size?: number;
    online?: boolean;
};

export function Avatar({ uri, name, size = 48, online }: Props) {
    const { colors } = useTheme();
    const initials =
        name
            ?.split(" ")
            .slice(0, 2)
            .map((p) => p[0])
            .join("")
            .toUpperCase() ?? "";

    return (
        <View style={{ width: size, height: size }}>
            {uri ? (
                <Image
                    source={{ uri }}
                    style={{
                        width: size,
                        height: size,
                        borderRadius: size / 2,
                        backgroundColor: colors.neutral[200],
                    }}
                />
            ) : (
                <View
                    style={{
                        width: size,
                        height: size,
                        borderRadius: size / 2,
                        backgroundColor: colors.primaryLight,
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <Text
                        style={{
                            color: colors.primaryDark,
                            fontWeight: "700",
                            fontSize: size * 0.34,
                        }}
                    >
                        {initials}
                    </Text>
                </View>
            )}
            {online != null ? (
                <View
                    style={{
                        position: "absolute",
                        right: 0,
                        bottom: 0,
                        width: size * 0.28,
                        height: size * 0.28,
                        borderRadius: 99,
                        backgroundColor: online ? colors.online : colors.neutral[400],
                        borderWidth: 2,
                        borderColor: colors.surface,
                    }}
                />
            ) : null}
        </View>
    );
}
