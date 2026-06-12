export const TICKET_CATEGORIES = [
  { id: 'microsoft365', label: 'Microsoft 365', icon: 'grid' },
  { id: 'outlook', label: 'Outlook', icon: 'mail' },
  { id: 'teams', label: 'Teams', icon: 'people' },
  { id: 'vpn', label: 'VPN', icon: 'lock' },
  { id: 'access', label: 'Доступы', icon: 'key' },
  { id: 'laptop', label: 'Ноутбук / ПК', icon: 'laptop' },
  { id: 'printer', label: 'Принтер', icon: 'print' },
  { id: 'internet', label: 'Интернет / Wi-Fi', icon: 'wifi' },
  { id: 'server', label: 'Серверы', icon: 'server' },
  { id: 'security', label: 'Информационная безопасность', icon: 'shield' },
  { id: 'telephony', label: 'Телефония', icon: 'phone' },
  { id: 'software', label: 'Бизнес-приложения', icon: 'apps' },
];

export const TICKET_PRIORITIES = [
  { id: 'critical', label: 'Критический', sla: 1 },
  { id: 'high', label: 'Высокий', sla: 4 },
  { id: 'medium', label: 'Средний', sla: 8 },
  { id: 'low', label: 'Низкий', sla: 24 },
];

export const TICKET_STATUSES = [
  { id: 'new', label: 'Новая' },
  { id: 'assigned', label: 'Назначена' },
  { id: 'in_progress', label: 'В работе' },
  { id: 'resolved', label: 'Решена' },
  { id: 'closed', label: 'Закрыта' },
];

export const USER_ROLES = {
  EMPLOYEE: 'employee',
  ENGINEER: 'engineer',
  ADMIN: 'admin',
};

export const AI_SYSTEM_PROMPT = `Ты — AI-ассистент IT службы поддержки компании. Помогаешь сотрудникам решить IT-проблемы.

Твоя задача:
1. Понять проблему пользователя
2. Задать уточняющие вопросы если нужно
3. Предложить пошаговое решение
4. Если проблема не решена — предложить создать заявку

Отвечай на русском языке. Будь дружелюбным, профессиональным и конкретным.
Если предлагаешь создать заявку, в конце добавь: [CREATE_TICKET: категория|приоритет|краткое_описание]
Категории: microsoft365, outlook, teams, vpn, access, laptop, printer, internet, server, security, telephony, software
Приоритеты: critical, high, medium, low`;
