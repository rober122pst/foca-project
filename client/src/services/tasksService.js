import api from './axiosConfig';

export const createTask = async (data) => {
    const res = await api.post('/user/tasks', data);
    return res.data;
};

export const patchTask = async (id, data) => {
    const res = await api.patch(`/user/tasks/${id}`, data);
    return res;
};

export const deleteTask = async (id) => {
    const res = await api.delete(`/user/tasks/${id}`);
    return res;
};
