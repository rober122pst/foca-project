import api from './axiosConfig';

export const getOverview = async (token) => {
    try {
        const res = await api.get('dashboard/overview', {
            headers: { Authorization: `Bearer ${token}` },
        });
        return res;
    } catch (e) {
        console.error('Acesso negado.', e);
    }
};
