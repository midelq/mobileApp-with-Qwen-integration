import { useState, useCallback, useRef } from 'react';
import { Message, ChatMessage, sendStreamingMessage } from '../services/qwenApi';

export function useChat(apiKey: string, model: string) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef(false);

  const sendMessage = useCallback(
    async (userText: string) => {
      if (!apiKey.trim()) {
        setError('Please set your API key in Settings first.');
        return;
      }

      if (!userText.trim() || isLoading) return;

      setError(null);
      const userMessage: Message = {
        id: Date.now().toString(),
        role: 'user',
        content: userText.trim(),
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, userMessage]);
      setIsLoading(true);
      abortRef.current = false;

      const assistantId = (Date.now() + 1).toString();
      const assistantMessage: Message = {
        id: assistantId,
        role: 'assistant',
        content: '',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);

      const chatHistory: ChatMessage[] = [...messages, userMessage].map((m) => ({
        role: m.role,
        content: m.content,
      }));

      try {
        await sendStreamingMessage(
          chatHistory,
          apiKey,
          model,
          (chunk, done) => {
            if (abortRef.current) return;
            if (!done && chunk) {
              setMessages((prev) =>
                prev.map((m) =>
                  m.id === assistantId
                    ? { ...m, content: m.content + chunk }
                    : m,
                ),
              );
            }
            if (done) {
              setIsLoading(false);
            }
          },
          'You are Qwen, a helpful AI assistant made by Alibaba Cloud. Be concise and helpful.',
        );
      } catch (err: unknown) {
        setIsLoading(false);
        const errorMessage =
          err instanceof Error ? err.message : 'An error occurred.';
        setError(errorMessage);
        setMessages((prev) => prev.filter((m) => m.id !== assistantId));
      }
    },
    [apiKey, model, messages, isLoading],
  );

  const clearChat = useCallback(() => {
    setMessages([]);
    setError(null);
  }, []);

  const dismissError = useCallback(() => setError(null), []);

  return { messages, isLoading, error, sendMessage, clearChat, dismissError };
}
