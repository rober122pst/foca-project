export const initialRoutinesFormState = {
    title: '',
    description: '',
    days: [0, 1, 2, 3, 4, 5, 6],
    color: '#ff0546',
    startTime: new Date(),
    endTime: new Date().setHours(new Date().getHours + 2),
};

export function routineFormReducer(state, action) {
    switch (action.type) {
        case 'SET_FIELD':
            return {
                ...state,
                [action.field]: action.value,
            };

        case 'RESET':
            return initialRoutinesFormState;

        default:
            return state;
    }
}
