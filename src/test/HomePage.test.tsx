import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import HomePage from '../pages/HomePage';

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: false,
        },
    },
});

const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
        <BrowserRouter>
            {children}
        </BrowserRouter>
    </QueryClientProvider>
);

describe('HomePage', () => {
    it('renders the main heading', () => {
        render(<HomePage />, { wrapper });
        expect(screen.getByText('Legal Document Review System')).toBeInTheDocument();
    });

    it('renders all feature cards', () => {
        render(<HomePage />, { wrapper });
        expect(screen.getByText('Projects')).toBeInTheDocument();
        expect(screen.getByText('Documents')).toBeInTheDocument();
        expect(screen.getByText('Field Templates')).toBeInTheDocument();
        expect(screen.getByText('Extractions')).toBeInTheDocument();
        expect(screen.getByText('Reviews')).toBeInTheDocument();
    });

    it('displays loading state initially', () => {
        render(<HomePage />, { wrapper });
        expect(screen.getByText('Connecting...')).toBeInTheDocument();
    });
});
