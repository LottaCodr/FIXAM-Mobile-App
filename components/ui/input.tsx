import React from "react";
import {
    View,
    Text,
    TextInput,
    TextInputProps,
} from "react-native";
import { useTheme } from "@/theme/useTheme";

type InputProps = TextInputProps & {
    label?: string;
    error?: string;
    helperText?: string;
};

export const Input = ({
    label,
    error,
    helperText,
    style,
    ...props
}: InputProps) => {
    const {
        colors,
        spacing,
        radius,
        typography,
    } = useTheme();

    const borderColor = error ? colors.error : colors.border;

    return (
        <View style={{ marginBottom: spacing[10] }}>
            {/* Label */}
            {label && (
                <Text
                    style={{
                        marginBottom: spacing[8],
                        ...typography.caption,
                        color: colors.textPrimary,
                        // fontWeight already in typography.caption; no need for override
                    }}
                >
                    {label}
                </Text>
            )}

            {/* Input Field */}
            <TextInput
                {...props}
                style={[
                    {
                        height: 48,
                        borderWidth: 1,
                        borderColor,
                        borderRadius: radius.md,
                        paddingHorizontal: spacing[4],
                        backgroundColor: colors.surface,
                        ...typography.body,
                        color: colors.textPrimary,
                    },
                    style,
                ]}
                placeholderTextColor={colors.textMuted}
            />

            {/* Helper / Error Text */}
            {(error || helperText) && (
                <Text
                    style={{
                        marginTop: spacing[4],
                        ...typography.caption,
                        color: error ? colors.error : colors.textSecondary,
                    }}
                >
                    {error || helperText}
                </Text>
            )}
        </View>
    );
};
