import api from './axiosConfig';

export async function createPomodoroSession(data) {
    const res = await api.post('/user/pomodoro', data);
    return res.data;
}

export async function getPomodoroSession(pomodoroId) {
    const res = await api.get(`/user/pomodoro/${pomodoroId}`);
    return res.data;
}

export async function pomodoroStart(pomodoroId) {
    return await api.get(`user/pomodoro/${pomodoroId}/start`);
}
