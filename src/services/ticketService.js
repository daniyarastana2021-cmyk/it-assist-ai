// Локальное хранилище заявок (без Firebase)
let tickets = [
  {
    id: '1',
    title: 'Не работает Outlook',
    description: 'Outlook не запускается после обновления Windows',
    category: 'outlook',
    priority: 'high',
    status: 'in_progress',
    createdBy: 'demo-user-001',
    createdByName: 'Демо Пользователь',
    createdAt: { toDate: () => new Date(Date.now() - 86400000) },
    comments: [],
  },
  {
    id: '2',
    title: 'Нет доступа к VPN',
    description: 'Не могу подключиться к корпоративному VPN из дома',
    category: 'vpn',
    priority: 'medium',
    status: 'new',
    createdBy: 'demo-user-001',
    createdByName: 'Демо Пользователь',
    createdAt: { toDate: () => new Date(Date.now() - 3600000) },
    comments: [],
  },
];

let nextId = 3;

export async function createTicket(data) {
  const id = String(nextId++);
  tickets.unshift({
    id,
    ...data,
    status: 'new',
    createdAt: { toDate: () => new Date() },
    comments: [],
  });
  return id;
}

export async function getMyTickets(userId) {
  return tickets.filter(t => t.createdBy === userId);
}

export async function getAllTickets() {
  return [...tickets];
}

export async function getTicketById(id) {
  return tickets.find(t => t.id === id) || null;
}

export async function updateTicketStatus(id, status) {
  const t = tickets.find(t => t.id === id);
  if (t) t.status = status;
}

export async function addComment(ticketId, userId, displayName, text) {
  const t = tickets.find(t => t.id === ticketId);
  if (t) {
    t.comments.push({ userId, displayName, text, createdAt: new Date().toISOString() });
  }
}

export function subscribeToTickets(userId, role, callback) {
  const data = role === 'employee'
    ? tickets.filter(t => t.createdBy === userId)
    : [...tickets];
  callback(data);
  return () => {};
}
