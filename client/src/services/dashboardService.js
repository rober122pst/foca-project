import api from './axiosConfig';

export const getOverview = async () => {
    try {
        const res = await api.get('dashboard/overview');
        return res;
    } catch (e) {
        console.error('Acesso negado.', e);
    }
};
