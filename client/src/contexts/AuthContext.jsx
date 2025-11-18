/* eslint-disable react-refresh/only-export-components */

import { createContext, useContext, useEffect, useState } from 'react';
import { loginUser, registerUser } from '../services/oauthService.js';

import { useNavigate } from 'react-router-dom';
import { refresh } from '../../../server/src/auth/refresh.controller.js';
import { getMe } from '../services/userService.js';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const navigate = useNavigate();

    const [user, setUser] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [accessToken, setAccessToken] = useState(null);
    const [refreshToken, setRefreshToken] = useState(localStorage.getItem('refreshToken') || null);

    useEffect(() => {
        if (refreshToken) {
            refreshSession();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const refreshSession = async () => {
        try {
            setIsLoading(true);
            const data = await refresh(refreshToken);

            setAccessToken(data.accessToken);
            setRefreshToken(data.refreshToken);

            // Atualiza o refresh token
            localStorage.setItem('refreshToken', data.refreshToken);

            await loadUser();
        } catch (error) {
            console.log('Sessão expirada: ', error);
            logout();
        } finally {
            setIsLoading(false);
        }
    };

    const loadUser = async () => {
        try {
            const res = await getMe();
            setUser(res.data);
        } catch (error) {
            setUser(null);
            console.error('Falha ao carregar usuário:', error);
        }
    };

    const login = async (data) => {
        const res = await loginUser(data);
        setIsLoggedIn(true);

        setAccessToken(res.accessToken);
        setRefreshToken(res.refreshToken);

        localStorage.setItem('refreshToken', res.refreshToken);

        await loadUser();
    };

    const register = async (data) => {
        await registerUser(data);
        setIsLoggedIn(true);

        setAccessToken(data.accessToken);
        setRefreshToken(data.refreshToken);

        localStorage.setItem('refreshToken', data.refreshToken);

        await loadUser();
    };

    const logout = () => {
        setUser(null);
        setIsLoading(false);
        setIsLoggedIn(false);
        setAccessToken(null);
        setRefreshToken(null);

        navigate('/auth');

        localStorage.removeItem('refreshToken');
    };

    return (
        <AuthContext.Provider
            value={{
                isLoggedIn,
                user,
                isLoading,
                accessToken,
                login,
                register,
                logout,
                refreshSession,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    // novo hook
    return useContext(AuthContext);
};
