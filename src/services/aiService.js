import { AI_CONFIG } from '../config/ai';
import { AI_SYSTEM_PROMPT } from '../config/constants';

export async function sendMessage(messages) {
  if (!AI_CONFIG.apiKey) {
    return {
      content: 'AI-ключ не настроен. Обратитесь к администратору системы или создайте заявку вручную.',
      isError: true,
    };
  }

  const response = await fetch(AI_CONFIG.baseUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': AI_CONFIG.apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: AI_CONFIG.model,
      max_tokens: AI_CONFIG.maxTokens,
      system: AI_SYSTEM_PROMPT,
      messages,
    }),
  });

  if (!response.ok) {
    throw new Error(`AI API error: ${response.status}`);
  }

  const data = await response.json();
  return { content: data.content[0].text, isError: false };
}

export function parseTicketFromAIResponse(text) {
  const match = text.match(/\[CREATE_TICKET:\s*([^|]+)\|([^|]+)\|([^\]]+)\]/);
  if (!match) return null;
  return {
    category: match[1].trim(),
    priority: match[2].trim(),
    description: match[3].trim(),
  };
}
