import { useQuery } from '@tanstack/react-query';
import { mockApi } from '../../../services/api/mockApi';
export const useAttendanceRecords = () => useQuery({ queryKey: ['attendance-records'], queryFn: mockApi.getAttendanceRecords });
