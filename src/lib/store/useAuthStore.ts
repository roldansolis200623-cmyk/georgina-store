'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  createdAt: string;
}

interface AuthStore {
  user: User | null;
  users: User[];
  isLoggedIn: boolean;
  
  register: (name: string, email: string, password: string) => { success: boolean; message: string };
  login: (email: string, password: string) => { success: boolean; message: string };
  logout: () => void;
  updateProfile: (name: string) => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      users: [],
      isLoggedIn: false,

      register: (name, email, password) => {
        const { users } = get();
        
        if (!name || !email || !password) {
          return { success: false, message: 'Todos los campos son requeridos' };
        }
        
        if (password.length < 6) {
          return { success: false, message: 'La contrasena debe tener al menos 6 caracteres' };
        }
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
          return { success: false, message: 'Email invalido' };
        }
        
        if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
          return { success: false, message: 'El email ya esta registrado' };
        }
        
        const newUser: User = {
          id: Date.now().toString(),
          name,
          email: email.toLowerCase(),
          password,
          createdAt: new Date().toISOString(),
        };
        
        set((state) => ({
          users: [...state.users, newUser],
          user: newUser,
          isLoggedIn: true,
        }));
        
        return { success: true, message: 'Registro exitoso. Bienvenida!' };
      },

      login: (email, password) => {
        const { users } = get();
        
        if (!email || !password) {
          return { success: false, message: 'Email y contrasena son requeridos' };
        }
        
        const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
        
        if (!user) {
          return { success: false, message: 'Usuario no encontrado' };
        }
        
        if (user.password !== password) {
          return { success: false, message: 'Contrasena incorrecta' };
        }
        
        set({ user, isLoggedIn: true });
        
        return { success: true, message: 'Bienvenida de vuelta!' };
      },

      logout: () => {
        set({ user: null, isLoggedIn: false });
      },

      updateProfile: (name) => {
        set((state) => ({
          user: state.user ? { ...state.user, name } : null,
          users: state.users.map(u => 
            u.id === state.user?.id ? { ...u, name } : u
          ),
        }));
      },
    }),
    {
      name: 'georgina-auth',
    }
  )
);
