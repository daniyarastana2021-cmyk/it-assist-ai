// Локальная база знаний (без Firebase)
let articles = [
  {
    id: '1',
    title: 'Не работает Outlook — первые шаги',
    category: 'outlook',
    tags: ['outlook', 'email', 'решение'],
    status: 'published',
    views: 42,
    helpful: 18,
    notHelpful: 2,
    author: 'IT Support',
    content: `## Проблема: Outlook не запускается или не синхронизирует почту

**Шаг 1.** Перезапустите Outlook и компьютер.

**Шаг 2.** Проверьте подключение к интернету.

**Шаг 3.** Запустите восстановление Office:
- Откройте "Параметры" → "Приложения"
- Найдите Microsoft 365 → "Изменить"
- Выберите "Быстрое восстановление"

**Шаг 4.** Очистите кэш Outlook:
- Нажмите Win+R, введите %localappdata%\\Microsoft\\Outlook
- Удалите файлы .ost (не .pst!)

Если проблема не решена — создайте заявку.`,
  },
  {
    id: '2',
    title: 'Подключение к VPN',
    category: 'vpn',
    tags: ['vpn', 'подключение', 'удалённая работа'],
    status: 'published',
    views: 35,
    helpful: 24,
    notHelpful: 1,
    author: 'IT Support',
    content: `## Настройка VPN-подключения

**Требования:** Учётная запись компании, установленный VPN-клиент.

**Шаг 1.** Запустите GlobalProtect (иконка в трее).

**Шаг 2.** Введите адрес сервера VPN (получите у IT).

**Шаг 3.** Войдите с корпоративными данными.

**Шаг 4.** При ошибке аутентификации — проверьте MFA в Microsoft Authenticator.

**Шаг 5.** Если соединение обрывается — смените сеть или перезапустите клиент.`,
  },
  {
    id: '3',
    title: 'Настройка Microsoft Teams',
    category: 'teams',
    tags: ['teams', 'видеозвонок', 'чат'],
    status: 'published',
    views: 28,
    helpful: 15,
    notHelpful: 0,
    author: 'IT Support',
    content: `## Первичная настройка Teams

**Установка:** Скачайте Teams с teams.microsoft.com или установите из Microsoft Store.

**Вход:** Используйте корпоративную почту (@yourcompany.kz).

**Микрофон и камера:**
- Настройки → Устройства
- Выберите нужные микрофон и камеру
- Проверьте через тестовый звонок

**Уведомления:** Настройки → Уведомления → настройте по приоритету.`,
  },
];

export async function getArticles(category = null) {
  if (category) return articles.filter(a => a.status === 'published' && a.category === category);
  return articles.filter(a => a.status === 'published');
}

export async function getArticleById(id) {
  const article = articles.find(a => a.id === id);
  if (article) article.views = (article.views || 0) + 1;
  return article || null;
}

export async function rateArticle(id, helpful) {
  const article = articles.find(a => a.id === id);
  if (article) {
    if (helpful) article.helpful = (article.helpful || 0) + 1;
    else article.notHelpful = (article.notHelpful || 0) + 1;
  }
}

export async function createArticle(data) {
  const id = String(Date.now());
  articles.push({ id, views: 0, helpful: 0, notHelpful: 0, status: 'published', ...data });
  return id;
}

export async function seedKBArticles() {}
