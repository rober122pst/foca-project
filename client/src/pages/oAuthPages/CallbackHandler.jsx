import { useEffect, useRef } from 'react';

import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

// Função auxiliar para ler um cookie (simples, mas funcional)

const getCookie = (name) => {
    const value = `; ${document.cookie}`;

    const parts = value.split(`; ${name}=`);

    if (parts.length === 2) return parts.pop().split(';').shift();
};

function CallbackHandler() {
    const { handleLoginSuccess } = useAuth();
    const navigate = useNavigate();

    const hasCalled = useRef(false);

    useEffect(() => {
        if (hasCalled.current) return;
        hasCalled.current = true;

        const token = getCookie(import.meta.env.VITE_TOKEN_COOKIE);
        const refreshToken = getCookie(import.meta.env.VITE_REFRESH_TOKEN_COOKIE);

        if (token && refreshToken) {
            document.cookie = `${import.meta.env.VITE_TOKEN_COOKIE}=; Max-Age=0; path=/;`;
            document.cookie = `${import.meta.env.VITE_REFRESH_TOKEN_COOKIE}=; Max-Age=0; path=/;`;

            console.log('Cookies temporários removidos.');

            handleLoginSuccess(token, refreshToken).then(() => {
                console.log('Estado sincronizado, redirecionando...');
                navigate('/dashboard', { replace: true });
            });

            navigate('/dashboard', { replace: true });
        } else {
            console.error('Falha ao receber o token de autenticação.');

            navigate('/auth', { replace: true });
        }
    }, [navigate, handleLoginSuccess]);

    return (
        <div>
            <p>A processar a autenticação...</p>
        </div>
    );
}

export default CallbackHandler;
