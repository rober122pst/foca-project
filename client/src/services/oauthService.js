import api from './axiosConfig';

export const registerUser = async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
};

export const loginUser = async (userData) => {
    const response = await api.post('/auth/login', userData);
    return response.data;
};

export const refresh = async (refreshToken) => {
    const response = await api.post('auth/refresh', { refreshToken });
    return response.data;
};
