import React, { useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppNavigator } from './src/navigation/AppNavigator';
import { STORAGE_KEYS, DEFAULT_MODEL } from './src/constants/models';

// Pre-seeded credentials — change if needed
const DEFAULT_API_KEY = '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';

export default function App() {
  useEffect(() => {
    (async () => {
      // Force overwrite the old dash-scope key with the new openrouter key
      await AsyncStorage.setItem(STORAGE_KEYS.API_KEY, DEFAULT_API_KEY);
      await AsyncStorage.setItem(STORAGE_KEYS.SELECTED_MODEL, DEFAULT_MODEL);
    })();
  }, []);

  return <AppNavigator />;
}

