import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

export function MainLayout({ children }) {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
