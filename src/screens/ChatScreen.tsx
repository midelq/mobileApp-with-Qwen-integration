import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  Keyboard,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useChat } from '../hooks/useChat';
import { MessageBubble } from '../components/MessageBubble';
import { TypingIndicator } from '../components/TypingIndicator';
import { STORAGE_KEYS, DEFAULT_MODEL } from '../constants/models';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useFocusEffect } from '@react-navigation/native';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Chat'>;
};

export function ChatScreen({ navigation }: Props) {
  const [apiKey, setApiKey] = useState('');
  const [model, setModel] = useState(DEFAULT_MODEL);
  const [input, setInput] = useState('');
  const flatListRef = useRef<FlatList>(null);
  const { messages, isLoading, error, sendMessage, clearChat, dismissError } =
    useChat(apiKey, model);

  const loadSettings = useCallback(async () => {
    const [savedKey, savedModel] = await Promise.all([
      AsyncStorage.getItem(STORAGE_KEYS.API_KEY),
      AsyncStorage.getItem(STORAGE_KEYS.SELECTED_MODEL),
    ]);
    if (savedKey) setApiKey(savedKey);
    if (savedModel) setModel(savedModel);
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadSettings();
    }, [loadSettings]),
  );

  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

  useEffect(() => {
    if (error) {
      Alert.alert('Error', error, [{ text: 'OK', onPress: dismissError }]);
    }
  }, [error, dismissError]);

  const handleSend = () => {
    if (!input.trim()) return;
    Keyboard.dismiss();
    sendMessage(input);
    setInput('');
  };

  const handleClear = () => {
    if (messages.length === 0) return;
    Alert.alert('New Chat', 'Clear current conversation?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Clear', style: 'destructive', onPress: clearChat },
    ]);
  };

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 30}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.logo}>
            <Text style={styles.logoText}>Q</Text>
          </View>
          <View>
            <Text style={styles.headerTitle}>Qwen Chat</Text>
            <Text style={styles.headerModel}>{model}</Text>
          </View>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.iconBtn} onPress={handleClear}>
            <Text style={styles.iconBtnText}>✏️</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.iconBtn}
            onPress={() => navigation.navigate('Settings')}>
            <Text style={styles.iconBtnText}>⚙️</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Messages */}
      {messages.length === 0 && !isLoading ? (
        <View style={styles.empty}>
          <View style={styles.emptyLogo}>
            <Text style={styles.emptyLogoText}>Q</Text>
          </View>
          <Text style={styles.emptyTitle}>Hello! I'm Qwen</Text>
          <Text style={styles.emptySubtitle}>
            Your AI assistant powered by Alibaba Cloud.{'\n'}Ask me anything!
          </Text>
          <View style={styles.suggestions}>
            {[
              '✨ Write me a poem',
              '🌍 Translate "Hello" to Chinese',
              '💡 Explain quantum computing',
              '🔢 Solve: x² + 5x + 6 = 0',
            ].map((s) => (
              <TouchableOpacity
                key={s}
                style={styles.suggestion}
                onPress={() => {
                  const text = s.split(' ').slice(1).join(' ');
                  sendMessage(text);
                }}>
                <Text style={styles.suggestionText}>{s}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      ) : (
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(m) => m.id}
          renderItem={({ item }) => <MessageBubble message={item} />}
          ListFooterComponent={isLoading ? <TypingIndicator /> : null}
          contentContainerStyle={styles.messageList}
          onContentSizeChange={() =>
            flatListRef.current?.scrollToEnd({ animated: true })
          }
        />
      )}

      {/* Input Bar */}
      <View style={styles.inputBar}>
        <TextInput
          style={styles.textInput}
          value={input}
          onChangeText={setInput}
          placeholder="Message Qwen..."
          placeholderTextColor="#4A4A6A"
          multiline
          maxLength={4000}
          returnKeyType="default"
        />
        <TouchableOpacity
          style={[styles.sendBtn, (!input.trim() || isLoading) && styles.sendBtnDisabled]}
          onPress={handleSend}
          disabled={!input.trim() || isLoading}>
          <Text style={styles.sendBtnText}>↑</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#0D0D1A' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 56 : 40,
    paddingBottom: 12,
    backgroundColor: '#13131F',
    borderBottomWidth: 1,
    borderBottomColor: '#1E1E2E',
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  logo: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: '#7C3AED',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: { color: '#fff', fontWeight: '800', fontSize: 18 },
  headerTitle: { color: '#E2E8F0', fontWeight: '700', fontSize: 16 },
  headerModel: { color: '#6B7280', fontSize: 11, marginTop: 1 },
  headerRight: { flexDirection: 'row', gap: 4 },
  iconBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#1E1E2E',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconBtnText: { fontSize: 16 },
  messageList: { paddingVertical: 12, flexGrow: 1 },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  emptyLogo: {
    width: 80,
    height: 80,
    borderRadius: 24,
    backgroundColor: '#7C3AED',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    shadowColor: '#7C3AED',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
  },
  emptyLogoText: { color: '#fff', fontSize: 40, fontWeight: '800' },
  emptyTitle: {
    color: '#E2E8F0',
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 8,
  },
  emptySubtitle: {
    color: '#6B7280',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 28,
  },
  suggestions: { width: '100%', gap: 8 },
  suggestion: {
    backgroundColor: '#1E1E2E',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#2D2D4E',
  },
  suggestionText: { color: '#A78BFA', fontSize: 14 },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 12,
    paddingVertical: 10,
    paddingBottom: Platform.OS === 'ios' ? 28 : 10,
    backgroundColor: '#13131F',
    borderTopWidth: 1,
    borderTopColor: '#1E1E2E',
    gap: 8,
  },
  textInput: {
    flex: 1,
    color: '#E2E8F0',
    fontSize: 15,
    backgroundColor: '#1E1E2E',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    maxHeight: 120,
    borderWidth: 1,
    borderColor: '#2D2D4E',
  },
  sendBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#7C3AED',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#7C3AED',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 4,
  },
  sendBtnDisabled: { backgroundColor: '#2D2D4E', shadowOpacity: 0 },
  sendBtnText: { color: '#fff', fontSize: 20, fontWeight: '700', marginTop: -2 },
});
