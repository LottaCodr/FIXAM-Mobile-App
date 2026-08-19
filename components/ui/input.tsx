import { useTheme } from "@/theme/useTheme";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
    Pressable,
    Text,
    TextInput,
    TextInputProps,
    View,
} from "react-native";

type InputProps = TextInputProps & {
    label?: string;
    error?: string;
    helperText?: string;
    leftIcon?: keyof typeof Ionicons.glyphMap;
    rightIcon?: keyof typeof Ionicons.glyphMap;
    onRightPress?: () => void;
};

export const Input = ({
    label,
    error,
    helperText,
    style,
    leftIcon,
    rightIcon,
    onRightPress,
    onFocus,
    onBlur,
    ...props
}: InputProps) => {
    const { colors, spacing, radius, typography } = useTheme();
    const [focused, setFocused] = useState(false);
    const borderColor = error
        ? colors.error
        : focused
          ? colors.primary
          : colors.border;

    return (
        <View style={{ marginBottom: spacing[4] }}>
            {label ? (
                <Text
                    style={{
                        marginBottom: spacing[2],
                        ...typography.captionMedium,
                        color: colors.textPrimary,
                    }}
                >
                    {label}
                </Text>
            ) : null}

            <View
                style={{
                    height: 52,
                    borderWidth: 1.5,
                    borderColor,
                    borderRadius: radius.md,
                    backgroundColor: colors.surface,
                    flexDirection: "row",
                    alignItems: "center",
                    paddingHorizontal: spacing[3],
                }}
            >
                {leftIcon ? (
                    <Ionicons
                        name={leftIcon}
                        size={18}
                        color={focused ? colors.primary : colors.textMuted}
                        style={{ marginRight: spacing[2] }}
                    />
                ) : null}
                <TextInput
                    {...props}
                    onFocus={(e) => {
                        setFocused(true);
                        onFocus?.(e);
                    }}
                    onBlur={(e) => {
                        setFocused(false);
                        onBlur?.(e);
                    }}
                    style={[
                        {
                            flex: 1,
                            height: "100%",
                            ...typography.body,
                            color: colors.textPrimary,
                            paddingVertical: 0,
                        },
                        style,
                    ]}
                    placeholderTextColor={colors.textMuted}
                />
                {rightIcon ? (
                    <Pressable onPress={onRightPress} hitSlop={10}>
                        <Ionicons name={rightIcon} size={18} color={colors.textMuted} />
                    </Pressable>
                ) : null}
            </View>

            {error || helperText ? (
                <Text
                    style={{
                        marginTop: spacing[1],
                        ...typography.caption,
                        color: error ? colors.error : colors.textSecondary,
                    }}
                >
                    {error || helperText}
                </Text>
            ) : null}
        </View>
    );
};
