import { Screen } from "@/components/layout/Screen";
import ArtisanSummary from "@/features/artisans/components/artisan.summary";
import JobIdPill from "@/features/jobs/components/job.id.pill";
import JobPhoto from "@/features/jobs/components/job.photo";
import { PaymentCard } from "@/features/jobs/components/payment.card";
import { Section } from "@/features/jobs/components/section";
import StatusPills from "@/features/jobs/components/status.pills";
import StickyActions from "@/features/jobs/components/sticky.actions";
import { useTheme } from "@/theme/ThemeProvider";
import { Ionicons } from "@expo/vector-icons";
import {
    View,
    Text,
    ScrollView,
} from "react-native";

export default function JobDetailsScreen() {
    const theme = useTheme();

    return (
        <Screen padded={false}>
            {/* Header */}
            <View
                style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: theme.spacing[4],
                }}
            >
                <Ionicons name="arrow-back" size={24} />
                <Text
                    style={{
                        fontSize: theme.typography.h3?.fontSize ?? 18,
                        fontWeight: theme.typography.h3?.fontWeight ?? "bold",
                    }}
                >
                    Job Details
                </Text>
                <Ionicons name="share-social-outline" size={22} />
            </View>

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                    paddingHorizontal: theme.spacing[4],
                    paddingBottom: 180,
                }}
            >
                {/* Status Pills */}
                <View
                    style={{
                        flexDirection: "row",
                        gap: theme.spacing[3],
                        marginBottom: theme.spacing[5],
                    }}
                >
                    <StatusPills />
                    <JobIdPill />
                </View>

                {/* Artisan Summary */}
                <ArtisanSummary />

                {/* Service Description */}
                <Section title="Service Provided">
                    Fixed leaking kitchen pipe and replaced u-bend. The work involved
                    replacing the main seal and pressure testing the system to ensure
                    no further leaks occur.
                </Section>

                {/* Job Photos */}
                <Text
                    style={{
                        fontSize: theme.typography.h3?.fontSize ?? 18,
                        fontWeight: theme.typography.h3?.fontWeight ?? "bold",
                        marginTop: theme.spacing[6],
                        marginBottom: theme.spacing[3],
                    }}
                >
                    Job Photos
                </Text>

                <View style={{ flexDirection: "row", gap: theme.spacing[3] }}>
                    <JobPhoto uri="https://images.unsplash.com/photo-1581578731548-c64695cc6952" />
                    <JobPhoto uri="https://images.unsplash.com/photo-1604066867775-43f48e3957d8" />
                    <JobPhoto uri="https://images.unsplash.com/photo-1581092334651-ddf26d9a09d1" />
                </View>

                {/* Payment Breakdown */}
                <PaymentCard />
            </ScrollView>

            {/* Sticky Actions */}
            <StickyActions />
        </Screen>
    );
}
