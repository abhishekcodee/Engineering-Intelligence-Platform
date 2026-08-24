// Local Database Engine for Offline / Static Host Authentication
// Follows exact database schema, password hashing, and user credential verification rules.

export interface DbUser {
  id: string;
  email: string;
  full_name: string;
  role: string;
  hashed_password: string;
  org_name?: string;
  avatar_url?: string;
  github_username?: string;
}

const DB_KEY = 'devpulse_users_db';
const SESSION_TOKEN_KEY = 'devpulse_token_session';

// Simple deterministic hash function for client database simulation
function hashPassword(password: string): string {
  let hash = 0;
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return `hash_v1_${Math.abs(hash)}_${password.length}`;
}

// Initial seed database
function getDbUsers(): DbUser[] {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem(DB_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      // reset
    }
  }
  const defaultUsers: DbUser[] = [
    {
      id: 'user-1',
      email: 'alex.owner@devpulse.io',
      full_name: 'Alex Mercer',
      role: 'OWNER',
      hashed_password: hashPassword('password123'),
      github_username: 'alexmercer',
      avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alexmercer',
    },
    {
      id: 'user-2',
      email: 'sarah.manager@devpulse.io',
      full_name: 'Sarah Chen',
      role: 'ENGINEERING_MANAGER',
      hashed_password: hashPassword('password123'),
      github_username: 'sarahchen',
    },
  ];
  localStorage.setItem(DB_KEY, JSON.stringify(defaultUsers));
  return defaultUsers;
}

function saveDbUsers(users: DbUser[]) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(DB_KEY, JSON.stringify(users));
  }
}

export function dbRegister(payload: {
  email: string;
  full_name: string;
  password: string;
  org_name?: string;
}) {
  const users = getDbUsers();
  const normalizedEmail = payload.email.trim().toLowerCase();

  const existing = users.find((u) => u.email.toLowerCase() === normalizedEmail);
  if (existing) {
    throw new Error('Email address already registered');
  }

  const newUser: DbUser = {
    id: `user_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
    email: normalizedEmail,
    full_name: payload.full_name.trim(),
    role: 'OWNER',
    hashed_password: hashPassword(payload.password),
    org_name: payload.org_name || 'DevPulse Org',
    avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(payload.full_name)}`,
  };

  users.push(newUser);
  saveDbUsers(users);

  const token = `token_jwt_${newUser.id}_${Date.now()}`;

  const userResponse = {
    id: newUser.id,
    email: newUser.email,
    full_name: newUser.full_name,
    role: newUser.role,
    avatar_url: newUser.avatar_url,
    github_username: newUser.github_username,
  };

  return { access_token: token, token_type: 'bearer', user: userResponse };
}

export function dbLogin(payload: { email: string; password: string }) {
  const users = getDbUsers();
  const normalizedEmail = payload.email.trim().toLowerCase();

  const user = users.find((u) => u.email.toLowerCase() === normalizedEmail);
  if (!user) {
    throw new Error('Invalid email or password.');
  }

  const inputHash = hashPassword(payload.password);
  if (user.hashed_password !== inputHash) {
    throw new Error('Invalid email or password.');
  }

  const token = `token_jwt_${user.id}_${Date.now()}`;

  const userResponse = {
    id: user.id,
    email: user.email,
    full_name: user.full_name,
    role: user.role,
    avatar_url: user.avatar_url,
    github_username: user.github_username,
  };

  return { access_token: token, token_type: 'bearer', user: userResponse };
}

export function dbGetMe(token: string) {
  const users = getDbUsers();
  const savedUserStr = typeof window !== 'undefined' ? localStorage.getItem('devpulse_user') : null;
  if (savedUserStr) {
    try {
      const savedUser = JSON.parse(savedUserStr);
      const user = users.find((u) => u.id === savedUser.id || u.email === savedUser.email);
      if (user) {
        return {
          id: user.id,
          email: user.email,
          full_name: user.full_name,
          role: user.role,
          avatar_url: user.avatar_url,
          github_username: user.github_username,
        };
      }
      return savedUser;
    } catch {
      // ignore
    }
  }
  throw new Error('Invalid authentication token');
}
