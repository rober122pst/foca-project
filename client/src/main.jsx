import './styles/index.css';

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import { AuthProvider } from './contexts/AuthContext.jsx';
import { MainLayout } from './layouts/MainLayout.jsx';

createRoot(document.getElementById('root')).render(
    <BrowserRouter>
        <AuthProvider>
            <MainLayout>
                <StrictMode>
                    <App />
                </StrictMode>
            </MainLayout>
        </AuthProvider>
    </BrowserRouter>
);
