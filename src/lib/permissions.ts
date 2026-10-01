import type { UserRole } from '../types/domain';

export type Permission = 'attendance.view' | 'attendance.upload' | 'students.view' | 'analytics.view' | 'reports.create' | 'users.manage' | 'settings.manage';
const rolePermissions: Record<UserRole, Permission[]> = {
  faculty: ['attendance.view', 'attendance.upload', 'students.view', 'analytics.view', 'reports.create'],
  program_coordinator: ['attendance.view', 'attendance.upload', 'students.view', 'analytics.view', 'reports.create'],
  department_head: ['attendance.view', 'students.view', 'analytics.view', 'reports.create'],
  administrator: ['attendance.view', 'attendance.upload', 'students.view', 'analytics.view', 'reports.create', 'users.manage', 'settings.manage'],
};
export const can = (role: UserRole, permission: Permission) => rolePermissions[role].includes(permission);
