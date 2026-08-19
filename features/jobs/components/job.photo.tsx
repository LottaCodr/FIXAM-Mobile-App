import { useTheme } from "@/theme/useTheme";
import { Image } from "expo-image";

export default function JobPhoto({ uri }: { uri: string }) {
    const theme = useTheme();

    return (
        <Image
            source={{ uri }}
            style={{
                width: 100,
                height: 80,
                borderRadius: theme.radius.md,
                backgroundColor: theme.colors.neutral[200],
            }}
            contentFit="cover"
            transition={200}
            accessibilityLabel="Job photo"
        />
    );
}
