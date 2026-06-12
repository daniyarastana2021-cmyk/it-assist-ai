// Add your Anthropic API key in environment or .env file
// For production: use a backend proxy — never expose keys in mobile app
export const AI_CONFIG = {
  apiKey: process.env.EXPO_PUBLIC_ANTHROPIC_API_KEY || '',
  model: 'claude-haiku-4-5-20251001',
  maxTokens: 1024,
  baseUrl: 'https://api.anthropic.com/v1/messages',
};
