import api from './axiosConfig';

export const getMe = async (token) => {
    try {
        const res = await api.get('user/me', {
            headers: { Authorization: `Bearer ${token}` },
        });
        return res;
    } catch (e) {
        console.error('Nenhum usuário logado.', e);
    }
};
