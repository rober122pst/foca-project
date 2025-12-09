import api from './axiosConfig';

export async function getTimeDistributionChart() {
    const res = await api.get('/user/chards/time-distribution');
    return res.data;
}
