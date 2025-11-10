import api from './axiosConfig';

export const getMe = async () => {
    try {
        const res = await api.get('user/me');
        return res;
    }catch (e) {
        console.error('Nenhum usuário logado.', e);
    }
};