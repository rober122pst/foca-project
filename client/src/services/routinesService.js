import api from './axiosConfig';

export const createRoutine = async (data) => {
    const res = await api.post('/user/routines', data);
    return res.data;
};

export const getRoutineById = async (id) => {
    const res = await api.get(`/user/routines/${id}`);
    return res;
};
