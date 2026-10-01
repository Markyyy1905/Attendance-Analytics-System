import { create } from 'zustand';
import type { UserRole } from '../types/domain';

type UiState = { role: UserRole; sidebarOpen: boolean; sidebarCollapsed: boolean; theme: 'light' | 'dark'; setRole: (role: UserRole) => void; setSidebarOpen: (open: boolean) => void; setSidebarCollapsed: (collapsed: boolean) => void; toggleTheme: () => void; };
export const useUiStore = create<UiState>((set) => ({ role: 'administrator', sidebarOpen: false, sidebarCollapsed: false, theme: 'light', setRole: (role) => set({ role }), setSidebarOpen: (sidebarOpen) => set({ sidebarOpen }), setSidebarCollapsed: (sidebarCollapsed) => set({ sidebarCollapsed }), toggleTheme: () => set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' })) }));
