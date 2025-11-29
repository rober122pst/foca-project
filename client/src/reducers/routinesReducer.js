export const initialRoutinesFormState = {
    title: '',
    description: '',
    days: [],
    dtstart: '2025-12-03',
    tag: 'Estudo',
    color: '#fb2c36',
    startTime: '12:00',
    endTime: '13:00',
};

export function routineFormReducer(state, action) {
    switch (action.type) {
        case 'SET_FIELD':
            return {
                ...state,
                [action.field]: action.value,
            };

        case 'TOGGLE_DAY': {
            const order = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
            const dayId = action.value;
            const isDaySelected = state.days.includes(dayId);

            const newDays = isDaySelected ? state.days.filter((d) => d !== dayId) : [...state.days, dayId];

            const sortedDays = newDays.sort((a, b) => order.indexOf(a) - order.indexOf(b));

            return {
                ...state,
                days: sortedDays,
            };
        }

        case 'RESET':
            return initialRoutinesFormState;

        default:
            return state;
    }
}
