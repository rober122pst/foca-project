export const initialTasksFormState = {
    title: '',
    description: '',
    deadline: '2025-12-01T08:10',
    priority: 'LOW',
};

export function taskFormReducer(state, action) {
    switch (action.type) {
        case 'SET_FIELD':
            return {
                ...state,
                [action.field]: action.value,
            };

        case 'RESET':
            return initialTasksFormState;

        default:
            return state;
    }
}
