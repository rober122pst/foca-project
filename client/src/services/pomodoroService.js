import api from './axiosConfig';

export async function createPomodoroSession(data) {
    const res = await api.post('/user/pomodoro', data);
    return res.data;
}
