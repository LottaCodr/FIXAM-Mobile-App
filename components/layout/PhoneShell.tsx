import type { ReactNode } from "react";
import { Platform, useWindowDimensions, View } from "react-native";

export function PhoneShell({ children }: { children: ReactNode }) {
    const { width, height } = useWindowDimensions();
    const framed = Platform.OS === "web" && width >= 560;

    if (!framed) {
        return <View style={{ flex: 1 }}>{children}</View>;
    }

    const phoneW = Math.min(390, width - 64);
    const phoneH = Math.min(844, height - 40);

    return (
        <View
            style={{
                flex: 1,
                backgroundColor: "#0B1220",
                alignItems: "center",
                justifyContent: "center",
            }}
        >
            <View
                style={{
                    position: "absolute",
                    top: 28,
                    left: 36,
                    opacity: 0.55,
                }}
            >
                {/* decorative brand mark for desktop preview */}
            </View>
            <View
                style={{
                    width: phoneW,
                    height: phoneH,
                    borderRadius: 40,
                    overflow: "hidden",
                    backgroundColor: "#fff",
                    borderWidth: 10,
                    borderColor: "#111827",
                    ...(Platform.OS === "web"
                        ? ({ boxShadow: "0 30px 80px rgba(0,0,0,0.45)" } as object)
                        : {}),
                }}
            >
                <View
                    style={{
                        height: 22,
                        backgroundColor: "#111827",
                        alignItems: "center",
                        justifyContent: "flex-end",
                        paddingBottom: 4,
                    }}
                >
                    <View
                        style={{
                            width: 92,
                            height: 6,
                            borderRadius: 99,
                            backgroundColor: "#374151",
                        }}
                    />
                </View>
                <View style={{ flex: 1 }}>{children}</View>
            </View>
        </View>
    );
}
