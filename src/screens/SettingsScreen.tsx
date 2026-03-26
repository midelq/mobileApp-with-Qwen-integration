import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { QWEN_MODELS, DEFAULT_MODEL, STORAGE_KEYS } from '../constants/models';
import { RootStackParamList } from '../navigation/AppNavigator';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Settings'>;
};

export function SettingsScreen({ navigation }: Props) {
  const [apiKey, setApiKey] = useState('');
  const [selectedModel, setSelectedModel] = useState(DEFAULT_MODEL);
  const [showKey, setShowKey] = useState(false);

  useEffect(() => {
    (async () => {
      const [savedKey, savedModel] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEYS.API_KEY),
        AsyncStorage.getItem(STORAGE_KEYS.SELECTED_MODEL),
      ]);
      if (savedKey) setApiKey(savedKey);
      if (savedModel) setSelectedModel(savedModel);
    })();
  }, []);

  const handleSave = async () => {
    if (!apiKey.trim()) {
      Alert.alert('Error', 'Please enter your API key.');
      return;
    }
    await Promise.all([
      AsyncStorage.setItem(STORAGE_KEYS.API_KEY, apiKey.trim()),
      AsyncStorage.setItem(STORAGE_KEYS.SELECTED_MODEL, selectedModel),
    ]);
    Alert.alert('Saved!', 'Your settings have been saved.', [
      { text: 'OK', onPress: () => navigation.goBack() },
    ]);
  };

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <StatusBar barStyle="light-content" />
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.logo}>
            <Text style={styles.logoText}>Q</Text>
          </View>
          <Text style={styles.title}>Settings</Text>
          <Text style={styles.subtitle}>Configure your Qwen AI connection</Text>
        </View>

        {/* API Key */}
        <View style={styles.section}>
          <Text style={styles.label}>API Key</Text>
          <Text style={styles.hint}>
            Get your key from{' '}
            <Text style={styles.link}>OpenRouter</Text>
          </Text>
          <View style={styles.inputRow}>
            <TextInput
              style={styles.input}
              value={apiKey}
              onChangeText={setApiKey}
              placeholder="sk-or-v1-xxxxxxxx"
              placeholderTextColor="#4A4A6A"
              secureTextEntry={!showKey}
              autoCapitalize="none"
              autoCorrect={false}
            />
            <TouchableOpacity
              style={styles.eyeBtn}
              onPress={() => setShowKey((v) => !v)}>
              <Text style={styles.eyeText}>{showKey ? '🙈' : '👁️'}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Model Selection */}
        <View style={styles.section}>
          <Text style={styles.label}>Model</Text>
          <View style={styles.modelGrid}>
            {QWEN_MODELS.map((m) => (
              <TouchableOpacity
                key={m.id}
                style={[
                  styles.modelCard,
                  selectedModel === m.id && styles.modelCardSelected,
                ]}
                onPress={() => setSelectedModel(m.id)}>
                <Text
                  style={[
                    styles.modelName,
                    selectedModel === m.id && styles.modelNameSelected,
                  ]}>
                  {m.name}
                </Text>
                <Text style={styles.modelDesc}>{m.description}</Text>
                {selectedModel === m.id && (
                  <View style={styles.selectedBadge}>
                    <Text style={styles.selectedBadgeText}>✓</Text>
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Save Button */}
        <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
          <Text style={styles.saveBtnText}>Save Settings</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#0D0D1A' },
  scroll: { flex: 1 },
  content: { padding: 20, paddingBottom: 40 },
  header: { alignItems: 'center', marginBottom: 32, marginTop: 16 },
  logo: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: '#7C3AED',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    shadowColor: '#7C3AED',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 8,
  },
  logoText: { color: '#fff', fontSize: 28, fontWeight: '800' },
  title: { color: '#E2E8F0', fontSize: 24, fontWeight: '700' },
  subtitle: { color: '#6B7280', fontSize: 14, marginTop: 4 },
  section: { marginBottom: 24 },
  label: {
    color: '#E2E8F0',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 6,
  },
  hint: { color: '#6B7280', fontSize: 12, marginBottom: 10 },
  link: { color: '#7C3AED' },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E1E2E',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#2D2D4E',
  },
  input: {
    flex: 1,
    color: '#E2E8F0',
    fontSize: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  eyeBtn: { padding: 14 },
  eyeText: { fontSize: 18 },
  modelGrid: { gap: 10 },
  modelCard: {
    backgroundColor: '#1E1E2E',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#2D2D4E',
    position: 'relative',
  },
  modelCardSelected: {
    borderColor: '#7C3AED',
    backgroundColor: '#1A0D33',
  },
  modelName: { color: '#E2E8F0', fontSize: 15, fontWeight: '600' },
  modelNameSelected: { color: '#A78BFA' },
  modelDesc: { color: '#6B7280', fontSize: 12, marginTop: 2 },
  selectedBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#7C3AED',
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedBadgeText: { color: '#fff', fontSize: 12, fontWeight: '700' },
  saveBtn: {
    backgroundColor: '#7C3AED',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
    shadowColor: '#7C3AED',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 6,
  },
  saveBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});
