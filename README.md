# Clarity Mentor

A TypeScript React Native 0.76.9 mobile adaptation of Clarity Mentor. It uses local mock mentor data, so a backend is not required to explore the UI and booking flow.

## Requirements

- Node.js 18 or newer
- Android Studio with an emulator/device for Android
- Xcode and CocoaPods for iOS

## Install

```bash
npm install
```

For iOS, install native pods once after JavaScript dependencies:

```bash
bundle install
cd ios && bundle exec pod install && cd ..
```

## Run with React Native CLI

```bash
npx react-native run-android
# or
npx react-native run-ios
```

## Architecture

- `src/components`: reusable branded controls, cards and layout primitives
- `src/navigation`: root, tab and drawer navigation
- `src/screens`: mobile app flows for onboarding, mentors, booking and profile
- `src/theme`: light/dark tokens plus persisted appearance preference
- `src/redux`: auth, mentors, booking, sessions, user and theme state

The supplied brand mark is bundled at `src/assets/images/clarity-logo.svg` and rendered with `react-native-svg@15.8.0`, which is compatible with React Native 0.76.9.
