import * as Crypto from 'expo-crypto';
import * as SecureStore from 'expo-secure-store';
import { useSQLiteContext } from 'expo-sqlite';
import { createContext, type ReactNode, useContext, useEffect, useMemo, useState } from 'react';

import { type User } from '@/types/models';

const SESSION_USER_ID_KEY = 'my_life_session_user_id';

type UserRow = User & {
  password_hash: string;
  password_salt: string;
};

type AuthContextValue = {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

async function hashPassword(password: string, salt: string) {
  return Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    `${salt}:${password}`,
  );
}

function toPublicUser(row: UserRow): User {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    created_at: row.created_at,
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const db = useSQLiteContext();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function restoreSession() {
      try {
        const storedUserId = await SecureStore.getItemAsync(SESSION_USER_ID_KEY);

        if (!storedUserId) {
          return;
        }

        const row = await db.getFirstAsync<UserRow>(
          'SELECT * FROM users WHERE id = ?',
          Number(storedUserId),
        );

        if (row) {
          setUser(toPublicUser(row));
        } else {
          await SecureStore.deleteItemAsync(SESSION_USER_ID_KEY);
        }
      } finally {
        setIsLoading(false);
      }
    }

    restoreSession();
  }, [db]);

  const value = useMemo<AuthContextValue>(() => ({
    user,
    isLoading,
    async login(email, password) {
      const normalizedEmail = email.trim().toLowerCase();

      if (!normalizedEmail || !password) {
        throw new Error('Enter your email and password.');
      }

      const row = await db.getFirstAsync<UserRow>(
        'SELECT * FROM users WHERE email = ?',
        normalizedEmail,
      );

      if (!row) {
        throw new Error('No account found for that email.');
      }

      const passwordHash = await hashPassword(password, row.password_salt);

      if (passwordHash !== row.password_hash) {
        throw new Error('The password is incorrect.');
      }

      const publicUser = toPublicUser(row);
      await SecureStore.setItemAsync(SESSION_USER_ID_KEY, String(publicUser.id));
      setUser(publicUser);
    },
    async register(name, email, password) {
      const trimmedName = name.trim();
      const normalizedEmail = email.trim().toLowerCase();

      if (!trimmedName || !normalizedEmail || !password) {
        throw new Error('Fill in all fields.');
      }

      if (password.length < 6) {
        throw new Error('Use at least 6 characters for your password.');
      }

      const existingUser = await db.getFirstAsync<UserRow>(
        'SELECT * FROM users WHERE email = ?',
        normalizedEmail,
      );

      if (existingUser) {
        throw new Error('An account with this email already exists.');
      }

      const passwordSalt = Crypto.randomUUID();
      const passwordHash = await hashPassword(password, passwordSalt);
      const createdAt = new Date().toISOString();

      const result = await db.runAsync(
        'INSERT INTO users (name, email, password_hash, password_salt, created_at) VALUES (?, ?, ?, ?, ?)',
        trimmedName,
        normalizedEmail,
        passwordHash,
        passwordSalt,
        createdAt,
      );

      const publicUser = {
        id: result.lastInsertRowId,
        name: trimmedName,
        email: normalizedEmail,
        created_at: createdAt,
      };

      await SecureStore.setItemAsync(SESSION_USER_ID_KEY, String(publicUser.id));
      setUser(publicUser);
    },
    async logout() {
      await SecureStore.deleteItemAsync(SESSION_USER_ID_KEY);
      setUser(null);
    },
  }), [db, isLoading, user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider.');
  }

  return context;
}
