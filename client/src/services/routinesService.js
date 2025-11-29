import api from './axiosConfig';

export const createRoutine = async (data) => {
    const res = await api.post('/user/events', data);
    return res.data;
};

export const createRoutineWithAi = async (data) => {
    const res = await api.post('/ai/gemini-routine', data);
    return res.data;
};

export const getRoutineById = async (id) => {
    const res = await api.get(`/user/events/${id}`);
    return res;
};

export const patchRoutine = async (id, data) => {
    const res = await api.patch(`/user/events/${id}`, data);
    return res;
};

export const deleteRoutine = async (id) => {
    const res = await api.delete(`/user/events/${id}`);
    return res;
};
