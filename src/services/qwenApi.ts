import EventSource from 'react-native-sse';
import { DASHSCOPE_API_URL } from '../constants/models';

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export type StreamingCallback = (chunk: string, done: boolean) => void;

export async function sendStreamingMessage(
  messages: ChatMessage[],
  apiKey: string,
  model: string,
  onChunk: StreamingCallback,
  systemPrompt?: string,
): Promise<void> {
  const allMessages: ChatMessage[] = [];

  if (systemPrompt) {
    allMessages.push({ role: 'system', content: systemPrompt });
  }
  allMessages.push(...messages);

  return new Promise((resolve, reject) => {
    const es = new EventSource(DASHSCOPE_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: allMessages,
        stream: true,
      }),
    });

    let hasResolved = false;

    es.addEventListener('message', (event) => {
      if (!event.data) return;
      if (event.data === '[DONE]') {
        es.close();
        if (!hasResolved) {
          hasResolved = true;
          onChunk('', true);
          resolve();
        }
        return;
      }

      try {
        const parsed = JSON.parse(event.data);
        const content = parsed.choices?.[0]?.delta?.content;
        if (content) {
          onChunk(content, false);
        }
      } catch (err) {
        // ignore parse error for stream chunks
      }
    });

    es.addEventListener('error', (event: any) => {
      es.close();
      if (!hasResolved) {
        hasResolved = true;
        reject(new Error(event.message || 'Streaming connection failed'));
      }
    });
  });
}

export async function sendMessage(
  messages: ChatMessage[],
  apiKey: string,
  model: string,
  systemPrompt?: string,
): Promise<string> {
  const allMessages: ChatMessage[] = [];

  if (systemPrompt) {
    allMessages.push({ role: 'system', content: systemPrompt });
  }
  allMessages.push(...messages);

  const response = await fetch(DASHSCOPE_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages: allMessages,
      stream: false,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    let errorMessage = `API Error: ${response.status}`;
    try {
      const errorJson = JSON.parse(errorText);
      errorMessage =
        errorJson?.error?.message || errorJson?.message || errorMessage;
    } catch {
      // use default error message
    }
    throw new Error(errorMessage);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content ?? '';
}
