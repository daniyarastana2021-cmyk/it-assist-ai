import {
  collection,
  getDocs,
  getDoc,
  doc,
  query,
  where,
  orderBy,
  addDoc,
  updateDoc,
  increment,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../config/firebase';

export async function getArticles(category = null) {
  let q = category
    ? query(
        collection(db, 'kb_articles'),
        where('status', '==', 'published'),
        where('category', '==', category),
        orderBy('views', 'desc')
      )
    : query(
        collection(db, 'kb_articles'),
        where('status', '==', 'published'),
        orderBy('views', 'desc')
      );
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

export async function getArticleById(id) {
  const snap = await getDoc(doc(db, 'kb_articles', id));
  if (!snap.exists()) return null;
  await updateDoc(doc(db, 'kb_articles', id), { views: increment(1) });
  return { id: snap.id, ...snap.data() };
}

export async function rateArticle(id, helpful) {
  await updateDoc(doc(db, 'kb_articles', id), {
    [helpful ? 'helpful' : 'notHelpful']: increment(1),
  });
}

export async function createArticle(data) {
  const ref = await addDoc(collection(db, 'kb_articles'), {
    ...data,
    views: 0,
    helpful: 0,
    notHelpful: 0,
    status: 'published',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return ref.id;
}

export async function seedKBArticles() {
  const articles = [
    {
      title: 'Не работает Outlook — первые шаги',
      category: 'outlook',
      tags: ['outlook', 'email', 'решение'],
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
      author: 'IT Support',
    },
    {
      title: 'Подключение к VPN',
      category: 'vpn',
      tags: ['vpn', 'подключение', 'удалённая работа'],
      content: `## Настройка VPN-подключения

**Требования:** Учётная запись компании, установленный VPN-клиент.

**Шаг 1.** Запустите GlobalProtect (иконка в трее).

**Шаг 2.** Введите адрес сервера VPN (получите у IT).

**Шаг 3.** Войдите с корпоративными данными.

**Шаг 4.** При ошибке аутентификации — проверьте MFA в Microsoft Authenticator.

**Шаг 5.** Если соединение обрывается — смените сеть или перезапустите клиент.`,
      author: 'IT Support',
    },
    {
      title: 'Настройка Microsoft Teams',
      category: 'teams',
      tags: ['teams', 'видеозвонок', 'чат'],
      content: `## Первичная настройка Teams

**Установка:** Скачайте Teams с teams.microsoft.com или установите из Microsoft Store.

**Вход:** Используйте корпоративную почту (@yourcompany.kz).

**Микрофон и камера:**
1. Настройки → Устройства
2. Выберите нужные микрофон и камеру
3. Проверьте через тестовый звонок

**Уведомления:** Настройки → Уведомления → настройте по приоритету.`,
      author: 'IT Support',
    },
  ];

  for (const article of articles) {
    const existing = await getDocs(
      query(collection(db, 'kb_articles'), where('title', '==', article.title))
    );
    if (existing.empty) {
      await createArticle(article);
    }
  }
}
