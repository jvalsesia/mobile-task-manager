# Family Task Manager

A modern, visually stunning React Native (Expo) application designed to help families and teams organize their daily tasks on a unified timeline.

## Features

- **Visual Timeline**: A sleek, deep-blue daily grid that groups tasks into dedicated columns for each family member.
- **Auto-Scrolling**: The timeline automatically recalculates and keeps the current time vertically centered, updating every 60 seconds.
- **Sympathetic Text-to-Speech Alarms**: Never miss a task. When a task is due, the app automatically triggers a native TTS alarm that politely addresses the member by name and announces the task.
- **Internationalization (i18n)**: Out of the box, the app utilizes a highly-performant, zero-dependency translation layer. Native support for Brazilian Portuguese (`pt-BR`, default) and English (`en-US`).
- **Data Persistence**: Uses `AsyncStorage` to securely and persistently save all member profiles and schedules between offline sessions.
- **Deep Blue Aesthetics**: A meticulously crafted dark-theme prioritizing highly legible slate-gray task blocks and vibrant sky-blue interactive elements.

## Tech Stack

- **Framework**: React Native with Expo
- **State Management**: React Context API
- **Local Storage**: `@react-native-async-storage/async-storage`
- **Native Modules**: 
  - `@react-native-community/datetimepicker` for clock routing.
  - `expo-speech` for dynamic TTS alarms.
  - `@react-native-picker/picker` for native platform dropdowns.

## Installation

1. **Clone the repository:**
   ```bash
   git clone <repository_url>
   cd mobile-task-manager
   ```

2. **Install dependencies:**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Run the Development Server:**
   This app utilizes native modules (e.g., `expo-speech` and `datetimepicker`), and runs on Expo.
   ```bash
   npx expo start
   ```

4. **Connect a Device:**
   Due to the native integrations, please run the application directly on an Android/iOS emulator or a physical device using Expo Go or a Development Build.

## Usage Guide
- **Adding Members**: Tap `+ Membro` in the top right to add a family member. By default, they will receive a column in the timeline.
- **Adding Tasks**: Tap `+ Tarefa` to assign a specific task to an existing member. You can define the duration and decide if you want the alarm enabled, and set how many minutes before the task starts the alarm should ring.
- **Managing Layouts**: To delete a task or a member, click the small "✕" icon on the corresponding task block or column header. A confirmation dialog will protect against accidental deletions.

## Customizing Languages
To change the default language from Brazilian Portuguese to English, modify `DEFAULT_LANG` in `src/i18n/index.js` to `'en-US'`.
