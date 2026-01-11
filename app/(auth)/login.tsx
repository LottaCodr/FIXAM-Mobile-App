import { PrimaryButton } from "@/components/ui/buttons";
import { Input } from "@/components/ui/input";
import { useRouter } from "expo-router";
import { View } from "react-native";

export default function Login() {
    const router = useRouter();

    return (
        <View style={{ flex: 1, padding: 24 }}>
            <Input
                label="Phone Number"
                placeholder="08012345678"
                keyboardType="phone-pad"
            />
            <Input
                label="Password"
                placeholder="*********"
                keyboardType="visible-password"
            />

            <PrimaryButton
                label="Continue"
                onPress={() => router.push("/(auth)/verify-otp")}
            />
        </View>
    );
}
