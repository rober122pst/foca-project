import api from './axiosConfig';

export const getOverview = async () => {
    try {
        const res = await api.get('dashboard/overview');
        return res;
    } catch (e) {
        console.error(e);
    }
};

export const getRoutinesDash = async () => {
    try {
        const res = await api.get('dashboard/routines');
        return res;
    } catch (e) {
        console.error(e);
    }
};
