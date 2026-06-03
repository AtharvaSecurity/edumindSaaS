'use client';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAuth = create<any>()(persist((set) => ({
  user: null, tenant: null, token: '', isAuth: false, theme: 'light',
  login: (u:any,t:any,tk:string) => set({ user:u, tenant:t, token:tk, isAuth:true }),
  logout: () => set({ user:null, tenant:null, token:'', isAuth:false }),
  toggleTheme: () => set((s:any) => ({ theme: s.theme==='light'?'dark':'light' })),
}), { name: 'edumind' }));
