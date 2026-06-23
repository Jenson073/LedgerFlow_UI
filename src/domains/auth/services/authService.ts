import { storage } from '~/shared/utils/storage';
import type { Credentials, SignupCredentials, User } from '../types/auth';

const USERS_KEY = 'accounting_users';
const SESSION_KEY = 'accounting_session';

const getStoredUsers = (): User[] => {
  const users = storage.get<User[]>(USERS_KEY, []);
  if (users.length === 0) {
    const defaultUser: User = {
      id: 'usr_default_1',
      email: 'accountant@example.com',
      name: 'Jane Doe, CPA',
      role: 'Accountant',
      createdAt: new Date().toISOString(),
    };
    storage.set<User[]>(USERS_KEY, [defaultUser]);
    storage.set<Record<string, string>>('accounting_user_passwords', {
      'accountant@example.com': 'password123',
    });
    return [defaultUser];
  }
  return users;
};

export const authService = {
  async login(credentials: Credentials): Promise<User> {
    getStoredUsers(); // Ensure default user exists

    const { email, password } = credentials;
    const passwords = storage.get<Record<string, string>>('accounting_user_passwords', {});
    const storedPassword = passwords[email];

    if (!storedPassword || storedPassword !== password) {
      throw new Error('Invalid email or password.');
    }

    const users = storage.get<User[]>(USERS_KEY, []);
    const user = users.find((u) => u.email === email);

    if (!user) {
      throw new Error('User record not found.');
    }

    storage.set<User>(SESSION_KEY, user);
    return user;
  },

  async register(credentials: SignupCredentials): Promise<User> {
    const { email, password, name } = credentials;
    const users = getStoredUsers();

    if (users.some((u) => u.email === email)) {
      throw new Error('Email is already registered.');
    }

    const newUser: User = {
      id: `usr_${Math.random().toString(36).substring(2, 9)}`,
      email,
      name,
      role: 'Accountant',
      createdAt: new Date().toISOString(),
    };

    const passwords = storage.get<Record<string, string>>('accounting_user_passwords', {});
    passwords[email] = password;
    storage.set<Record<string, string>>('accounting_user_passwords', passwords);

    users.push(newUser);
    storage.set<User[]>(USERS_KEY, users);
    storage.set<User>(SESSION_KEY, newUser);
    return newUser;
  },

  async logout(): Promise<void> {
    storage.remove(SESSION_KEY);
  },

  async getCurrentUser(): Promise<User | null> {
    return storage.get<User | null>(SESSION_KEY, null);
  },
};
