import api from './axiosConfig';

export const createRoutine = async (data) => {
    const res = await api.post('/user/routines', data);
    return res.data;
};
