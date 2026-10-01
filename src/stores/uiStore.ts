import { create } from 'zustand';
import type { UserRole } from '../types/domain';

type UiState = { role: UserRole; sidebarOpen: boolean; theme: 'light' | 'dark'; setRole: (role: UserRole) => void; setSidebarOpen: (open: boolean) => void; toggleTheme: () => void; };
export const useUiStore = create<UiState>((set) => ({ role: 'administrator', sidebarOpen: false, theme: 'light', setRole: (role) => set({ role }), setSidebarOpen: (sidebarOpen) => set({ sidebarOpen }), toggleTheme: () => set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' })) }));
