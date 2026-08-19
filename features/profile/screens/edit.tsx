import { AppHeader } from "@/components/layout/header";
import { Screen } from "@/components/layout/Screen";
import { AppButton } from "@/components/ui/buttons";
import { Input } from "@/components/ui/input";
import { useAuthStore } from "@/store/auth.store";
import { useUIStore } from "@/store/ui.store";
import { useTheme } from "@/theme/useTheme";
import { useRouter } from "expo-router";
import { useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView } from "react-native";

export default function EditProfileScreen() {
    const user = useAuthStore((s) => s.user);
    const updateUser = useAuthStore((s) => s.updateUser);
    const showToast = useUIStore((s) => s.showToast);
    const router = useRouter();
    const theme = useTheme();

    const [name, setName] = useState(user?.name ?? "");
    const [email, setEmail] = useState(user?.email ?? "");
    const [address, setAddress] = useState(user?.address ?? "");
    const [location, setLocation] = useState(user?.location ?? "");

    const save = () => {
        const firstName = name.trim().split(" ")[0] || user?.firstName || "there";
        updateUser({ name: name.trim(), email: email.trim(), address: address.trim(), location: location.trim(), firstName });
        showToast("Profile updated", "success");
        router.back();
    };

    return (
        <Screen padded={false}>
            <AppHeader title="Edit profile" />
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === "ios" ? "padding" : undefined}
            >
                <ScrollView contentContainerStyle={{ padding: theme.spacing[4] }}>
                    <Input label="Full name" value={name} onChangeText={setName} leftIcon="person-outline" />
                    <Input
                        label="Email"
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        leftIcon="mail-outline"
                    />
                    <Input
                        label="Area"
                        value={location}
                        onChangeText={setLocation}
                        leftIcon="navigate-outline"
                    />
                    <Input
                        label="Address"
                        value={address}
                        onChangeText={setAddress}
                        leftIcon="location-outline"
                    />
                    <AppButton label="Save changes" onPress={save} />
                </ScrollView>
            </KeyboardAvoidingView>
        </Screen>
    );
}
