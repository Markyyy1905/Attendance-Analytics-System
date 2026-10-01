import { useQuery } from '@tanstack/react-query';
import { mockApi } from '../../../services/api/mockApi';
export const useAttendanceAnalytics = () => useQuery({ queryKey: ['attendance-analytics'], queryFn: mockApi.getAnalytics });
