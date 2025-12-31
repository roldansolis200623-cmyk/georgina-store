'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  createdAt: string;
}

interface UserStore {
  users: User[];
  currentUser: User | null;
  isLoggedIn: boolean;

  register: (email: string, name: string, password: string, phone?: string) => { success: boolean; message: string };
  login: (email: string, password: string) => { success: boolean; message: string };
  logout: () => void;
  updateUser: (data: Partial<User>) => void;
}

interface StoredUser extends User {
  password: string;
}

export const useUserStore = create<UserStore>()(
  persist(
    (set, get) => ({
      users: [],
      currentUser: null,
      isLoggedIn: false,

      register: (email, name, password, phone) => {
        const { users } = get();
        
        if (users.find((u) => u.email.toLowerCase() === email.toLowerCase())) {
          return { success: false, message: 'Este email ya está registrado' };
        }

        if (password.length < 6) {
          return { success: false, message: 'La contraseña debe tener al menos 6 caracteres' };
        }

        const newUser: StoredUser = {
          id: Date.now().toString(),
          email: email.toLowerCase(),
          name,
          phone,
          password,
          createdAt: new Date().toISOString(),
        };

        // Store with password for auth
        if (typeof window !== 'undefined') {
          const storedUsers = JSON.parse(localStorage.getItem('georgina-users-auth') || '[]');
          storedUsers.push(newUser);
          localStorage.setItem('georgina-users-auth', JSON.stringify(storedUsers));
        }

        // Store without password in state
        const { password: _, ...userWithoutPassword } = newUser;
        set((state) => ({
          users: [...state.users, userWithoutPassword],
          currentUser: userWithoutPassword,
          isLoggedIn: true,
        }));

        return { success: true, message: '¡Cuenta creada exitosamente!' };
      },

      login: (email, password) => {
        if (typeof window === 'undefined') {
          return { success: false, message: 'Error de autenticación' };
        }

        const storedUsers: StoredUser[] = JSON.parse(
          localStorage.getItem('georgina-users-auth') || '[]'
        );

        const user = storedUsers.find(
          (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
        );

        if (!user) {
          return { success: false, message: 'Email o contraseña incorrectos' };
        }

        const { password: _, ...userWithoutPassword } = user;
        set({
          currentUser: userWithoutPassword,
          isLoggedIn: true,
        });

        return { success: true, message: '¡Bienvenido de vuelta!' };
      },

      logout: () => {
        set({
          currentUser: null,
          isLoggedIn: false,
        });
      },

      updateUser: (data) => {
        set((state) => ({
          currentUser: state.currentUser
            ? { ...state.currentUser, ...data }
            : null,
        }));
      },
    }),
    {
      name: 'georgina-user',
      partialize: (state) => ({
        currentUser: state.currentUser,
        isLoggedIn: state.isLoggedIn,
      }),
    }
  )
);