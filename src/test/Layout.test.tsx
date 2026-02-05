import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Layout from '../components/Layout';

describe('Layout', () => {
    it('renders the sidebar with navigation items', () => {
        render(
            <BrowserRouter>
                <Layout>
                    <div>Test Content</div>
                </Layout>
            </BrowserRouter>
        );

        expect(screen.getByText('Legal Review')).toBeInTheDocument();
        expect(screen.getByText('Home')).toBeInTheDocument();
        expect(screen.getByText('Projects')).toBeInTheDocument();
        expect(screen.getByText('Documents')).toBeInTheDocument();
    });

    it('renders children content', () => {
        render(
            <BrowserRouter>
                <Layout>
                    <div>Test Content</div>
                </Layout>
            </BrowserRouter>
        );

        expect(screen.getByText('Test Content')).toBeInTheDocument();
    });
});
