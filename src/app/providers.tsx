import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';
import { useUiStore } from '../stores/uiStore';
import { useEffect } from 'react';
const queryClient = new QueryClient({ defaultOptions: { queries: { staleTime: 30_000 } } });
export function Providers({ children }: { children: ReactNode }) { const theme = useUiStore((state) => state.theme); useEffect(() => { document.documentElement.dataset.theme = theme; }, [theme]); return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>; }
