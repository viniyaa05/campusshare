// ---------------------------------------------------------------------------
// CampusShare mock API layer.
//
// Every function here returns a Promise, so swapping this out for real
// fetch()/axios calls to a backend later is a drop-in replacement — no
// component code should need to change, only what's inside these functions.
//
// Data is persisted to localStorage so the app behaves like a real app
// across refreshes without needing a server.
// ---------------------------------------------------------------------------

const DB_KEYS = {
  USERS: 'cs_users',
  ITEMS: 'cs_items',
  REQUESTS: 'cs_requests',
  SESSION: 'cs_session',
};

const CATEGORIES = [
  'Textbooks',
  'Electronics',
  'Sports Gear',
  'Kitchen & Appliances',
  'Tools',
  'Musical Instruments',
  'Furniture',
  'Costumes & Event Gear',
];

function delay(ms = 350) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function read(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function write(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function uid(prefix = 'id') {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

// ---- Seed data (only runs once, on first load) ----------------------------

function seedIfEmpty() {
  const users = read(DB_KEYS.USERS, null);
  if (users) return;

  const seedUsers = [
    {
      id: 'u_demo',
      name: 'Riya Menon',
      email: 'riya@campus.edu',
      password: 'password123',
      hostel: 'Lake View Hostel',
      createdAt: Date.now() - 1000 * 60 * 60 * 24 * 40,
    },
  ];

  const seedItems = [
    {
      id: 'i_1',
      ownerId: 'u_demo',
      ownerName: 'Riya Menon',
      title: 'TI-84 Graphing Calculator',
      category: 'Electronics',
      description: 'Barely used, great for calc & stats courses. Comes with case.',
      condition: 'Like New',
      location: 'Lake View Hostel',
      status: 'available',
      imageColor: '#3B6E52',
      createdAt: Date.now() - 1000 * 60 * 60 * 24 * 3,
    },
    {
      id: 'i_2',
      ownerId: 'u_demo',
      ownerName: 'Riya Menon',
      title: 'Organic Chemistry, 9th Edition',
      category: 'Textbooks',
      description: 'Wade\'s Organic Chemistry. Some highlighter marks in ch. 1-4.',
      condition: 'Good',
      location: 'Lake View Hostel',
      status: 'available',
      imageColor: '#E3A72A',
      createdAt: Date.now() - 1000 * 60 * 60 * 24 * 10,
    },
    {
      id: 'i_3',
      ownerId: 'u_demo',
      ownerName: 'Riya Menon',
      title: 'Badminton Racket Set (2)',
      category: 'Sports Gear',
      description: 'Two rackets + shuttlecocks. Good for casual evening games.',
      condition: 'Good',
      location: 'Sports Complex',
      status: 'requested',
      imageColor: '#B5482A',
      createdAt: Date.now() - 1000 * 60 * 60 * 24 * 1,
    },
  ];

  write(DB_KEYS.USERS, seedUsers);
  write(DB_KEYS.ITEMS, seedItems);
  write(DB_KEYS.REQUESTS, []);
}

seedIfEmpty();

// ---- Auth -------------------------------------------------------------

export async function registerUser({ name, email, password, hostel }) {
  await delay();
  const users = read(DB_KEYS.USERS, []);
  if (users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
    throw new Error('An account with this email already exists.');
  }
  const user = {
    id: uid('u'),
    name,
    email,
    password,
    hostel: hostel || '',
    createdAt: Date.now(),
  };
  users.push(user);
  write(DB_KEYS.USERS, users);
  const { password: _pw, ...safeUser } = user;
  write(DB_KEYS.SESSION, safeUser);
  return safeUser;
}

export async function loginUser({ email, password }) {
  await delay();
  const users = read(DB_KEYS.USERS, []);
  const user = users.find(
    (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
  );
  if (!user) {
    throw new Error('Incorrect email or password.');
  }
  const { password: _pw, ...safeUser } = user;
  write(DB_KEYS.SESSION, safeUser);
  return safeUser;
}

export async function logoutUser() {
  await delay(150);
  localStorage.removeItem(DB_KEYS.SESSION);
}

export function getSession() {
  return read(DB_KEYS.SESSION, null);
}

export async function updateProfile(userId, updates) {
  await delay();
  const users = read(DB_KEYS.USERS, []);
  const idx = users.findIndex((u) => u.id === userId);
  if (idx === -1) throw new Error('User not found.');
  users[idx] = { ...users[idx], ...updates };
  write(DB_KEYS.USERS, users);
  const { password: _pw, ...safeUser } = users[idx];
  write(DB_KEYS.SESSION, safeUser);
  return safeUser;
}

// ---- Categories ---------------------------------------------------------

export async function getCategories() {
  await delay(150);
  return CATEGORIES;
}

// ---- Items ----------------------------------------------------------------

export async function getItems({ query = '', category = '' } = {}) {
  await delay();
  let items = read(DB_KEYS.ITEMS, []);
  if (category) {
    items = items.filter((i) => i.category === category);
  }
  if (query.trim()) {
    const q = query.trim().toLowerCase();
    items = items.filter(
      (i) =>
        i.title.toLowerCase().includes(q) ||
        i.description.toLowerCase().includes(q) ||
        i.category.toLowerCase().includes(q)
    );
  }
  return items.sort((a, b) => b.createdAt - a.createdAt);
}

export async function getItemById(id) {
  await delay(200);
  const items = read(DB_KEYS.ITEMS, []);
  const item = items.find((i) => i.id === id);
  if (!item) throw new Error('Item not found.');
  return item;
}

export async function getItemsByOwner(ownerId) {
  await delay();
  const items = read(DB_KEYS.ITEMS, []);
  return items
    .filter((i) => i.ownerId === ownerId)
    .sort((a, b) => b.createdAt - a.createdAt);
}

export async function createItem(item) {
  await delay();
  const items = read(DB_KEYS.ITEMS, []);
  const newItem = {
    id: uid('i'),
    status: 'available',
    createdAt: Date.now(),
    ...item,
  };
  items.push(newItem);
  write(DB_KEYS.ITEMS, items);
  return newItem;
}

export async function updateItem(id, updates) {
  await delay();
  const items = read(DB_KEYS.ITEMS, []);
  const idx = items.findIndex((i) => i.id === id);
  if (idx === -1) throw new Error('Item not found.');
  items[idx] = { ...items[idx], ...updates };
  write(DB_KEYS.ITEMS, items);
  return items[idx];
}

export async function deleteItem(id) {
  await delay();
  const items = read(DB_KEYS.ITEMS, []);
  write(DB_KEYS.ITEMS, items.filter((i) => i.id !== id));
}

// ---- Requests ---------------------------------------------------------

export async function createRequest({ itemId, requesterId, requesterName, message }) {
  await delay();
  const items = read(DB_KEYS.ITEMS, []);
  const item = items.find((i) => i.id === itemId);
  if (!item) throw new Error('Item not found.');
  if (item.ownerId === requesterId) {
    throw new Error('You cannot request your own item.');
  }

  const requests = read(DB_KEYS.REQUESTS, []);
  const newRequest = {
    id: uid('r'),
    itemId,
    itemTitle: item.title,
    ownerId: item.ownerId,
    requesterId,
    requesterName,
    message: message || '',
    status: 'pending',
    createdAt: Date.now(),
  };
  requests.push(newRequest);
  write(DB_KEYS.REQUESTS, requests);

  const itemIdx = items.findIndex((i) => i.id === itemId);
  items[itemIdx] = { ...items[itemIdx], status: 'requested' };
  write(DB_KEYS.ITEMS, items);

  return newRequest;
}

// Requests where the user owns the item (incoming) and requests the user made (outgoing)
export async function getRequestsForUser(userId) {
  await delay();
  const requests = read(DB_KEYS.REQUESTS, []);
  return {
    incoming: requests
      .filter((r) => r.ownerId === userId)
      .sort((a, b) => b.createdAt - a.createdAt),
    outgoing: requests
      .filter((r) => r.requesterId === userId)
      .sort((a, b) => b.createdAt - a.createdAt),
  };
}

export async function respondToRequest(requestId, status) {
  // status: 'accepted' | 'declined'
  await delay();
  const requests = read(DB_KEYS.REQUESTS, []);
  const idx = requests.findIndex((r) => r.id === requestId);
  if (idx === -1) throw new Error('Request not found.');
  requests[idx] = { ...requests[idx], status };
  write(DB_KEYS.REQUESTS, requests);

  const items = read(DB_KEYS.ITEMS, []);
  const itemIdx = items.findIndex((i) => i.id === requests[idx].itemId);
  if (itemIdx !== -1) {
    items[itemIdx] = {
      ...items[itemIdx],
      status: status === 'accepted' ? 'lent' : 'available',
    };
    write(DB_KEYS.ITEMS, items);
  }

  return requests[idx];
}

export async function getDashboardStats(userId) {
  await delay();
  const items = read(DB_KEYS.ITEMS, []);
  const requests = read(DB_KEYS.REQUESTS, []);
  const myItems = items.filter((i) => i.ownerId === userId);
  return {
    totalListed: myItems.length,
    currentlyLent: myItems.filter((i) => i.status === 'lent').length,
    pendingRequests: requests.filter((r) => r.ownerId === userId && r.status === 'pending').length,
    itemsBorrowed: requests.filter((r) => r.requesterId === userId && r.status === 'accepted').length,
  };
}
