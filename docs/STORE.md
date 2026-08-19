# Ship FixAm with EAS

This project is configured for **EAS Build**, **EAS Submit**, and **EAS Update**. You still need paid Apple Developer ($99/yr), a Google Play developer account ($25 once), and an Expo account.

## 1. One-time accounts

1. [expo.dev/signup](https://expo.dev/signup)
2. Apple Developer → create App ID `ng.fixam.app`, enable Sign in with Apple and Associated Domains.
3. App Store Connect → New App. Copy the numeric Apple ID into `ASC_APP_ID`.
4. Google Play Console → Create app → set up a Play service account JSON (never commit it).
5. Host `store/legal/privacy.html` and `terms.html` at `https://fixam.ng/privacy` and `/terms`.

## 2. Link the project

```bash
npm i -g eas-cli
eas login
eas init                 # writes extra.eas.projectId
eas update:configure     # writes updates.url
```

Put the project ID in `.env` as `EAS_PROJECT_ID=` as well so `app.config.ts` can build the update URL in CI.

Add secrets (never in git):

```bash
eas secret:create --name EXPO_PUBLIC_SUPABASE_URL --value https://xxx.supabase.co
eas secret:create --name EXPO_PUBLIC_SUPABASE_ANON_KEY --value eyJ...
eas secret:create --name EXPO_PUBLIC_FLW_PUBLIC_KEY --value FLWPUBK_...
eas secret:create --scope account --name ASC_APP_ID --value 1234567890
```

Android submit: `eas credentials` or set `GOOGLE_SERVICE_ACCOUNT_KEY` / pass `--key` to submit. Keep `google-play-service-account.json` out of the repo.

## 3. Build

```bash
# Dev client (internal)
npx eas-cli build --profile development --platform all

# Stakeholder APK / ad-hoc
npx eas-cli build --profile preview --platform all

# Store binaries (AAB + IPA)
npx eas-cli build --profile production --platform all
```

Production uses `autoIncrement` with `cli.appVersionSource: remote`. Bump the marketing version in `app.config.ts` (`version`) when you change store-facing features.

## 4. Submit

```bash
npx eas-cli submit --profile production --platform ios
npx eas-cli submit --profile production --platform android
```

iOS lands in TestFlight. Android lands as a **draft** on the production track — promote in Play Console after review.

## 5. OTA updates

```bash
npx eas-cli update --channel production --message "Fix checkout copy"
```

`runtimeVersion.policy` is `appVersion`. JS-only fixes go out as updates. Native changes (new SDK, new permissions) need a new store build.

## 6. Reviewer checklist

- [ ] Privacy URL live and matches in-app Privacy policy  
- [ ] Account deletion works (Profile → Delete account)  
- [ ] Sign in with Apple works on iOS if Google/Facebook are shown  
- [ ] No advertising ID (blocked on Android)  
- [ ] No broad photo library permission  
- [ ] Export compliance: “No non-exempt encryption” (`usesNonExemptEncryption: false`)  
- [ ] Play Data safety form matches `store/listings/play-data-safety.md`  
- [ ] App Privacy labels match `store/listings/ios-privacy-nutrition.md`  
- [ ] Screenshots for 6.7" iPhone and Play phone  
- [ ] Feature graphic uploaded (`store/assets/play-feature-graphic.png`)

## Identifiers

| | |
| --- | --- |
| iOS bundle | `ng.fixam.app` |
| Android applicationId | `ng.fixam.app` |
| URL scheme | `fixam://` |
| Associated domains | `applinks:fixam.ng` |
