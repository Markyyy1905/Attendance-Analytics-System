import { useQuery } from '@tanstack/react-query';
import { mockApi } from '../../../services/api/mockApi';
export const useStudents = () => useQuery({ queryKey: ['students'], queryFn: mockApi.getStudents });
