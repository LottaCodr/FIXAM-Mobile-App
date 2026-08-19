import { AppHeader } from "@/components/layout/header";
import { Screen } from "@/components/layout/Screen";
import { PRIVACY_SECTIONS, TERMS_SECTIONS } from "@/features/legal/copy";
import { useTheme } from "@/theme/useTheme";
import { ScrollView, Text, View } from "react-native";

export function LegalDocument({ kind }: { kind: "privacy" | "terms" }) {
    const theme = useTheme();
    const title = kind === "privacy" ? "Privacy policy" : "Terms of use";
    const sections = kind === "privacy" ? PRIVACY_SECTIONS : TERMS_SECTIONS;

    return (
        <Screen padded={false}>
            <AppHeader title={title} subtitle="FixAm · Nigeria" />
            <ScrollView contentContainerStyle={{ padding: theme.spacing[4], paddingBottom: 48 }}>
                <Text style={{ ...theme.typography.caption, color: theme.colors.textMuted, marginBottom: 16 }}>
                    Effective 19 August 2026. Hosted copy: https://fixam.ng/{kind === "privacy" ? "privacy" : "terms"}
                </Text>
                {sections.map((section) => (
                    <View key={section.title} style={{ marginBottom: theme.spacing[5] }}>
                        <Text style={{ ...theme.typography.h4, marginBottom: 6 }}>{section.title}</Text>
                        <Text style={{ ...theme.typography.body, color: theme.colors.textSecondary }}>
                            {section.body}
                        </Text>
                    </View>
                ))}
            </ScrollView>
        </Screen>
    );
}
