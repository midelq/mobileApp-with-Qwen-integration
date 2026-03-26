export interface QwenModel {
  id: string;
  name: string;
  description: string;
}

export const QWEN_MODELS: QwenModel[] = [
  {
    id: 'qwen/qwen-turbo',
    name: 'Qwen Turbo',
    description: 'Fast & cost-effective',
  },
  {
    id: 'qwen/qwen-plus',
    name: 'Qwen Plus',
    description: 'Balanced performance',
  },
  {
    id: 'qwen/qwen-max',
    name: 'Qwen Max',
    description: 'Most capable model',
  },
  {
    id: 'qwen/qwen-2.5-72b-instruct',
    name: 'Qwen 2.5 72B',
    description: 'Best open source Qwen',
  },
];

export const DEFAULT_MODEL = 'qwen/qwen-turbo';

export const DASHSCOPE_API_URL =
  'https://openrouter.ai/api/v1/chat/completions';

export const STORAGE_KEYS = {
  API_KEY: '@qwen_api_key',
  SELECTED_MODEL: '@qwen_selected_model',
};
