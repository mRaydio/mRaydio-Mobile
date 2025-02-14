<div style="display: flex; align-items: center; gap: 20px;">
    <img src="source/assets/svg/logo/logo.svg" alt="mRaydio Logo" width="50" height="44" />
    <h1>mRaydio</h1>
</div>

Create and broadcast your own radio station directly from your mobile device.

## Overview

mRaydio is a revolutionary mobile application that transforms your smartphone into a personal radio station. Built with React Native, it enables users to create, manage, and broadcast their own radio content to listeners worldwide. Whether you're a music enthusiast, podcast creator, or aspiring radio host, mRaydio provides the tools to reach your audience.

## Features

### Broadcasting

- Live audio broadcasting from your device's microphone
- Upload and schedule pre-recorded content
- Music playlist management and scheduling
- Real-time listener statistics
- Automated programming schedule

### Listening

- Discover user-created radio stations
- Live stream access to all broadcasts
- Program schedule viewing
- Favorite station bookmarking
- Background audio playback

### Content Management

- Audio file library management
- Program scheduling system
- Playlist creation and management
- Broadcast history tracking
- Content categorization

## Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd mraydio-app
```

2. Install dependencies:

```bash
npm install
# or
yarn install
```

3. iOS specific setup:

```bash
cd ios
pod install
cd ..
```

## Running the Application

### Starting the Metro Bundler

```bash
npm start
# or
yarn start
```

### Running on Device

### iOS

```bash
npm run ios
# or
yarn ios
```

### Android

```bash
npm run android
# or
yarn android
```

## Project Structure

```plaintext
mraydio-app/
├── android/          # Android native code
├── ios/             # iOS native code
└── source/          # React Native source code
    ├── assets/      # Static assets
```

## Features & Permissions

The application requires the following device permissions:

- Microphone access (for live broadcasting)
- Audio playback
- Background audio
- Media library access (for uploaded content)
- Internet connectivity
- Storage access (for cached content)
