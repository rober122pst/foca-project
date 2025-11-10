import { createContext, useState, useEffect, useContext } from 'react';
import { getMe } from '../services/userService.js';
import { loginUser, registerUser } from '../services/oauthService.js';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const res = await getMe();
                setIsLoggedIn(true);
                setUser(res.data);
            } catch (error) {
                setIsLoggedIn(false);
                setUser(null);
                console.error('Falha na auteticação:', error);
            }finally {
                setIsLoading(false);
            }
        };
        checkAuth();
    }, []);
    
    const login = async (data) => {
        await loginUser(data);
        setIsLoggedIn(true);
    };
    
    const register = async (data) => {
        await registerUser(data);
    };

    return (
        <AuthContext.Provider value={{ 
            isLoggedIn, 
            user, 
            isLoading, 
            login, 
            register }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => { // novo hook (acho que se chama assim)
    return useContext(AuthContext);
};