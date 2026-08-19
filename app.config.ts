import type { ExpoConfig } from "expo/config";

const projectId =
    process.env.EAS_PROJECT_ID || process.env.EXPO_PUBLIC_EAS_PROJECT_ID || "";

const config: ExpoConfig = {
    name: "FixAm",
    slug: "fixam",
    scheme: "fixam",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/icon.png",
    userInterfaceStyle: "automatic",
    primaryColor: "#1F7A5B",
    description:
        "Book verified plumbers, electricians, AC techs and more in Lagos. Pay securely with Flutterwave and track the job in real time.",
    runtimeVersion: {
        policy: "appVersion",
    },
    updates: projectId
        ? {
              url: `https://u.expo.dev/${projectId}`,
              fallbackToCacheTimeout: 0,
              checkAutomatically: "ON_LOAD",
          }
        : {
              fallbackToCacheTimeout: 0,
              checkAutomatically: "ON_LOAD",
          },
    ios: {
        bundleIdentifier: "ng.fixam.app",
        buildNumber: "1",
        supportsTablet: true,
        usesAppleSignIn: true,
        requireFullScreen: false,
        config: {
            usesNonExemptEncryption: false,
        },
        infoPlist: {
            CFBundleDisplayName: "FixAm",
            LSApplicationCategoryType: "public.app-category.lifestyle",
            ITSAppUsesNonExemptEncryption: false,
        },
        privacyManifests: {
            NSPrivacyTracking: false,
            NSPrivacyTrackingDomains: [],
            NSPrivacyCollectedDataTypes: [
                {
                    NSPrivacyCollectedDataType: "NSPrivacyCollectedDataTypePhoneNumber",
                    NSPrivacyCollectedDataTypeLinked: true,
                    NSPrivacyCollectedDataTypeTracking: false,
                    NSPrivacyCollectedDataTypePurposes: [
                        "NSPrivacyCollectedDataTypePurposeAppFunctionality",
                    ],
                },
                {
                    NSPrivacyCollectedDataType: "NSPrivacyCollectedDataTypeEmailAddress",
                    NSPrivacyCollectedDataTypeLinked: true,
                    NSPrivacyCollectedDataTypeTracking: false,
                    NSPrivacyCollectedDataTypePurposes: [
                        "NSPrivacyCollectedDataTypePurposeAppFunctionality",
                    ],
                },
                {
                    NSPrivacyCollectedDataType: "NSPrivacyCollectedDataTypeName",
                    NSPrivacyCollectedDataTypeLinked: true,
                    NSPrivacyCollectedDataTypeTracking: false,
                    NSPrivacyCollectedDataTypePurposes: [
                        "NSPrivacyCollectedDataTypePurposeAppFunctionality",
                    ],
                },
                {
                    NSPrivacyCollectedDataType: "NSPrivacyCollectedDataTypePhysicalAddress",
                    NSPrivacyCollectedDataTypeLinked: true,
                    NSPrivacyCollectedDataTypeTracking: false,
                    NSPrivacyCollectedDataTypePurposes: [
                        "NSPrivacyCollectedDataTypePurposeAppFunctionality",
                    ],
                },
                {
                    NSPrivacyCollectedDataType: "NSPrivacyCollectedDataTypePaymentInfo",
                    NSPrivacyCollectedDataTypeLinked: true,
                    NSPrivacyCollectedDataTypeTracking: false,
                    NSPrivacyCollectedDataTypePurposes: [
                        "NSPrivacyCollectedDataTypePurposeAppFunctionality",
                    ],
                },
                {
                    NSPrivacyCollectedDataType: "NSPrivacyCollectedDataTypeUserID",
                    NSPrivacyCollectedDataTypeLinked: true,
                    NSPrivacyCollectedDataTypeTracking: false,
                    NSPrivacyCollectedDataTypePurposes: [
                        "NSPrivacyCollectedDataTypePurposeAppFunctionality",
                    ],
                },
                {
                    NSPrivacyCollectedDataType: "NSPrivacyCollectedDataTypeProductInteraction",
                    NSPrivacyCollectedDataTypeLinked: true,
                    NSPrivacyCollectedDataTypeTracking: false,
                    NSPrivacyCollectedDataTypePurposes: [
                        "NSPrivacyCollectedDataTypePurposeAppFunctionality",
                        "NSPrivacyCollectedDataTypePurposeAnalytics",
                    ],
                },
            ],
            NSPrivacyAccessedAPITypes: [
                {
                    NSPrivacyAccessedAPIType: "NSPrivacyAccessedAPICategoryUserDefaults",
                    NSPrivacyAccessedAPITypeReasons: ["CA92.1"],
                },
                {
                    NSPrivacyAccessedAPIType: "NSPrivacyAccessedAPICategoryFileTimestamp",
                    NSPrivacyAccessedAPITypeReasons: ["C617.1"],
                },
                {
                    NSPrivacyAccessedAPIType: "NSPrivacyAccessedAPICategoryDiskSpace",
                    NSPrivacyAccessedAPITypeReasons: ["E174.1"],
                },
                {
                    NSPrivacyAccessedAPIType: "NSPrivacyAccessedAPICategorySystemBootTime",
                    NSPrivacyAccessedAPITypeReasons: ["35F9.1"],
                },
            ],
        },
        associatedDomains: ["applinks:fixam.ng", "applinks:www.fixam.ng"],
    },
    android: {
        package: "ng.fixam.app",
        versionCode: 1,
        adaptiveIcon: {
            foregroundImage: "./assets/images/android-icon-foreground.png",
            backgroundImage: "./assets/images/android-icon-background.png",
            monochromeImage: "./assets/images/android-icon-monochrome.png",
            backgroundColor: "#1F7A5B",
        },
        softwareKeyboardLayoutMode: "resize",
        allowBackup: false,
        predictiveBackGestureEnabled: false,
        permissions: ["INTERNET", "ACCESS_NETWORK_STATE", "VIBRATE"],
        blockedPermissions: [
            "android.permission.READ_MEDIA_IMAGES",
            "android.permission.READ_MEDIA_VIDEO",
            "android.permission.READ_MEDIA_VISUAL_USER_SELECTED",
            "android.permission.READ_EXTERNAL_STORAGE",
            "android.permission.WRITE_EXTERNAL_STORAGE",
            "com.google.android.gms.permission.AD_ID",
        ],
        intentFilters: [
            {
                action: "VIEW",
                autoVerify: true,
                data: [
                    { scheme: "https", host: "fixam.ng", pathPrefix: "/app" },
                    { scheme: "https", host: "www.fixam.ng", pathPrefix: "/app" },
                ],
                category: ["BROWSABLE", "DEFAULT"],
            },
        ],
    },
    web: {
        output: "static",
        favicon: "./assets/images/favicon.png",
        bundler: "metro",
        name: "FixAm",
        shortName: "FixAm",
        lang: "en-NG",
        themeColor: "#1F7A5B",
        backgroundColor: "#1F7A5B",
    },
    plugins: [
        "expo-router",
        [
            "expo-splash-screen",
            {
                image: "./assets/images/splash-icon.png",
                imageWidth: 200,
                resizeMode: "contain",
                backgroundColor: "#1F7A5B",
                dark: {
                    backgroundColor: "#145A42",
                },
            },
        ],
        [
            "expo-build-properties",
            {
                ios: {
                    deploymentTarget: "16.4",
                },
                android: {
                    compileSdkVersion: 36,
                    targetSdkVersion: 36,
                    minSdkVersion: 24,
                    enableMinifyInReleaseBuilds: true,
                },
            },
        ],
        "expo-font",
        "expo-web-browser",
        "expo-updates",
    ],
    extra: {
        eas: projectId ? { projectId } : {},
        privacyPolicyUrl: "https://fixam.ng/privacy",
        termsOfServiceUrl: "https://fixam.ng/terms",
        supportUrl: "https://fixam.ng/help",
        supportEmail: "hello@fixam.ng",
    },
    experiments: {
        typedRoutes: true,
        reactCompiler: true,
    },
};

export default config;
