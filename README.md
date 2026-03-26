# Qwen Chatbot App (React Native/Expo)

A modern, responsive chat application built with React Native (Expo) that integrates directly with **[OpenRouter](https://openrouter.ai/)** to chat with AI models, primarily focusing on Alibaba Cloud's **Qwen** series.

## Features
- 💬 **Streaming Responses:** Real-time text generation (chunk by chunk) powered by `react-native-sse`.
- 🎨 **Modern Dark UI:** Clean, glassmorphism-inspired dark mode interface with typing indicators.
- ⚙️ **In-App Settings:** Securely input and save your API key and choose models directly within the app.
- 🧹 **New Chat:** Instantly clear the history and start a fresh session.
- 🔒 **Secure by Design:** API keys are not hardcoded. They are stored locally on your device via `AsyncStorage`.

## Screenshots
*(Add screenshots here)*

## Installation

1. **Clone the repository:**
   ```bash
   git clone <your-repo-url>
   cd mobileApp-with-Qwen-integration
   ```

2. **Install dependencies:**
   Make sure to use `--legacy-peer-deps` or exactly mapped versions, as this project runs on Expo SDK 54 with React 19.
   ```bash
   npm install --legacy-peer-deps
   ```

3. **Start the development server:**
   ```bash
   npx expo start -c
   ```

## How to use

1. **Get an API Key:**
   Go to [OpenRouter Keys](https://openrouter.ai/keys) and create a new API key. It should start with `sk-or-v1-`.
   
2. **Configure the App:**
   - Open the app via the Expo Go app on your phone.
   - Tap the ⚙️ (Gear icon) in the top-right corner.
   - Paste your OpenRouter API key.
   - Select your preferred Qwen model.
   - Tap **Save Settings**.

3. **Start Chatting:**
   Go back to the chat screen and send a message. Qwen will respond in real-time!

## Technologies Used
- React Native (Expo SDK 54)
- TypeScript
- `@react-navigation/native` (Stack Navigator)
- `@react-native-async-storage/async-storage`
- `react-native-sse` (For Server-Sent Events / streaming endpoints)

## Security Warning 🚨
**Never commit your API keys to GitHub!**
This project requires you to enter the API key inside the app's settings screen. There are no hardcoded keys in this codebase. If you ever accidentally commit an API key, revoke it immediately at your provider's dashboard.
