import { Screen } from "@/components/layout/Screen";
import { useTheme } from "@/theme/ThemeProvider";
import { Ionicons } from "@expo/vector-icons";
import {
    Image,
    Pressable,
    ScrollView,
    Text,
    View,
} from "react-native";

export default function ArtisanProfileScreen() {
    const theme = useTheme();

    return (
        <Screen padded={false}>
            <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                    contentContainerStyle={{
                        paddingBottom: 140,
                        
 }}
            >
                    {/* Header Image */}
                    <View style={{ height: 260, position: "relative" }}>
                        
                        <Image
                            source={{
                                uri: "https://randomuser.me/api/portraits/men/75.jpg", 
                            }}
                            style={{
                                width: "100%",
                                height: "100%",
                               
                            }}
                            resizeMode="cover"
                            
                            fadeDuration={250}
                        />

                        <View
                            style={{
                                position: "absolute",
                                inset: 0,
                                backgroundColor: "rgba(0,0,0,0.35)",
                            }}
                        />

                        
                        {/* Header Actions */}
                        <View
                            style={{
                                position: "absolute",
                                top: theme.spacing[6],
                                left: theme.spacing[4],
                                right: theme.spacing[4],
                                flexDirection: "row",
                                justifyContent: "space-between",
                            }}
                        >
                            <HeaderIcon name="arrow-back" />
                            <View style={{ flexDirection: "row", gap: 12 }}>
                                <HeaderIcon name="share-social-outline" />
                                <HeaderIcon name="heart-outline" />
                            </View>
                        </View>
                    </View>

                    {/* Content */}
                    
                    <View style={{ paddingHorizontal: theme.spacing[4], }}>

                        {/* Profile Card */}
                        <View
                            style={{
                                backgroundColor: "#fff",
                                borderRadius: 20,
                                padding: theme.spacing[4],
                                marginTop: -40,
                                shadowColor: "#000",
                                shadowOpacity: 0.1,
                                shadowRadius: 10,
                                elevation: 6,
                            }}
                        >
                            {/* Name */}
                            <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                                <Text style={{ fontSize: 22, fontWeight: "700" }}>
                                    Segun Repairs
                                </Text>
                                <View
                                    style={{
                                        backgroundColor: "#D1FAE5",
                                        paddingHorizontal: 10,
                                        paddingVertical: 4,
                                        borderRadius: 999,
                                    }}
                                >
                                    <Text
                                        style={{
                                            color: "#059669",
                                            fontSize: 12,
                                            fontWeight: "600",
                                        }}
                                    >
                                        ✔ VERIFIED
                                    </Text>
                                </View>
                            </View>

                            <Text style={{ color: theme.colors.textMuted, marginTop: 4 }}>
                                Professional Plumber
                            </Text>

                            {/* Stats */}
                            <View
                                style={{
                                    flexDirection: "row",
                                    justifyContent: "space-between",
                                    marginTop: theme.spacing[4],
                                }}
                            >
                                <Stat label="Years Exp." value="5" />
                                <Stat label="Jobs done" value="120+" />
                                <Stat label="Rating" value="⭐ 4.9" />
                            </View>

                            {/* Actions */}
                            <View
                                style={{
                                    flexDirection: "row",
                                    gap: 12,
                                    marginTop: theme.spacing[4],
                                }}
                            >
                                <ActionButton icon="call-outline" label="Call" />
                                <ActionButton icon="chatbubble-outline" label="Chat" />
                            </View>
                        </View>

                        {/* About */}
                        <Section title="About Segun">
                            Licensed professional plumber with over 5 years of experience in
                            residential and commercial repairs. Specialist in leak detection,
                            pipe fitting, and water heater maintenance. Available for emergency
                            call-outs across Lagos mainland.
                        </Section>

                        {/* Reviews */}
                        <View
                            style={{
                                marginTop: theme.spacing[6],
                                flexDirection: "row",
                                justifyContent: "space-between",
                                alignItems: "center",
                            }}
                        >
                            <Text style={{ fontSize: 18, fontWeight: "700" }}>
                                Recent Reviews
                            </Text>
                            <Text style={{ color: theme.colors.primary, fontWeight: "600" }}>
                                See All
                            </Text>
                        </View>

                        <ReviewCard
                            name="Emeka Obi"
                            time="2 days ago"
                            rating={5}
                            comment="Segun fixed a major leak in my kitchen within an hour. Very professional and tidy. Highly recommended!"
                        />

                        <ReviewCard
                            name="Amina Yusuf"
                            time="1 week ago"
                            rating={4}
                            comment="Arrived on time and solved my toilet drainage issue. Good value for money."
                        />
                    </View>


                    {/* Sticky CTA */}
                    <View
                        style={{
                            position: "absolute",
                            bottom: 0,
                            left: 0,
                            right: 0,
                            padding: theme.spacing[4],
                            backgroundColor: "#fff",
                        }}
                    >
                        <Pressable
                            style={{
                                backgroundColor: "#FF9800",
                                paddingVertical: 16,
                                borderRadius: 14,
                                alignItems: "center",
                            }}
                        >
                            <Text style={{ color: "#fff", fontSize: 18, fontWeight: "700" }}>
                                Request Job
                            </Text>
                        </Pressable>
                    </View>
            </ScrollView>
                </View>
        </Screen>
    );
}


function HeaderIcon({ name }: { name: any }) {
    return (
        <Pressable
            style={{
                backgroundColor: "rgba(0,0,0,0.5)",
                padding: 10,
                borderRadius: 999,
            }}
        >
            <Ionicons name={name} size={20} color="#fff" />
        </Pressable>
    );
}


function Stat({ label, value }: { label: string; value: string }) {
    return (
        <View style={{ alignItems: "center" }}>
            <Text style={{ fontSize: 18, fontWeight: "700" }}>{value}</Text>
            <Text style={{ color: "#6B7280", fontSize: 12 }}>{label}</Text>
        </View>
    );
}


function ActionButton({
    icon,
    label,
}: {
    icon: any;
    label: string;
}) {
    return (
        <Pressable
            style={{
                flex: 1,
                flexDirection: "row",
                gap: 8,
                paddingVertical: 12,
                borderRadius: 12,
                backgroundColor: "#E8F5EE",
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            <Ionicons name={icon} size={18} color="#059669" />
            <Text style={{ fontWeight: "600" }}>{label}</Text>
        </Pressable>
    );
}


function Section({ title, children }: any) {
    return (
        <View style={{ marginTop: 24 }}>
            <Text style={{ fontSize: 18, fontWeight: "700", marginBottom: 8 }}>
                {title}
            </Text>
            <Text style={{ color: "#4B5563", lineHeight: 22 }}>
                {children}
            </Text>
        </View>
    );
}


function ReviewCard({
    name,
    time,
    rating,
    comment,
}: any) {
    return (
        <View
            style={{
                backgroundColor: "#fff",
                padding: 16,
                borderRadius: 14,
                marginTop: 16,
            }}
        >
            <Text style={{ fontWeight: "700" }}>{name}</Text>
            <Text style={{ color: "#9CA3AF", fontSize: 12 }}>{time}</Text>
            <Text style={{ marginVertical: 6 }}>
                {"⭐".repeat(rating)}
            </Text>
            <Text style={{ color: "#4B5563" }}>{comment}</Text>
        </View>
    );
}
