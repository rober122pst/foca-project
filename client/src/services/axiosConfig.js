import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const refreshToken = localStorage.getItem('refreshToken');

                if (!refreshToken) {
                    throw new Error('Sem refresh token');
                }

                const response = await axios.post(`${import.meta.env.VITE_API_URL}/auth/refresh`, {
                    refreshToken: refreshToken,
                });

                const { accessToken: newToken, refreshToken: newRefreshToken } = response.data;

                localStorage.setItem('refreshToken', newRefreshToken);
                localStorage.setItem('token', newToken);

                api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
                originalRequest.headers['Authorization'] = `Bearer ${newToken}`;

                return api(originalRequest);
            } catch (refreshError) {
                console.error('Sessão expirada', refreshError);
                localStorage.removeItem('token');
                localStorage.removeItem('refreshToken');
                // window.location.href = '/auth';
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default api;
