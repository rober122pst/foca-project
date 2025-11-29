export const initialRoutinesFormState = {
    title: '',
    type: 'TASK',
    description: '',
    rruleConfig: {
        enabled: false,
        freq: 'DAILY',
        interval: 1,
        byDay: [],
        endType: 'NEVER',
        untilDate: new Date(),
        count: 10,
    },
    dtstart: new Date(),
    dtend: null,
    deadline: new Date(),
    deadlineTime: '23:30',
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

        case 'SET_TYPE': {
            let newRRuleConfig = { ...state.rruleConfig };
            let newDeadline = state.deadline;

            if (action.value === 'TASK') {
                newRRuleConfig.enabled = false;
                if (!newDeadline) newDeadline = state.dtend;
                newDeadline = new Date();
            } else if (action.value === 'EVENT') {
                newRRuleConfig.enabled = false;
                newDeadline = null;
            } else if (action.value === 'HABIT') {
                newRRuleConfig.enabled = true;
                if (newRRuleConfig.endType === 'UNTIL') newRRuleConfig.endType = 'NEVER';
                newDeadline = null;
            } else if (action.value === 'PROJECT') {
                newRRuleConfig.enabled = true;
                if (!newRRuleConfig.untilDate) newRRuleConfig.untilDate = state.dtend;
                newRRuleConfig.endType = 'UNTIL';
                newDeadline = null;
            }

            return {
                ...state,
                type: action.value,
                rruleConfig: newRRuleConfig,
                deadline: newDeadline,
            };
        }

        case 'TOGGLE_DAY': {
            const currentDays = state.rruleConfig.byDay;
            const newDays = currentDays.includes(action.day)
                ? currentDays.filter((d) => d !== action.day)
                : [...currentDays, action.day];

            return {
                ...state,
                rruleConfig: { ...state.rruleConfig, byDay: newDays },
            };
        }

        case 'SET_RRULE': {
            return {
                ...state,
                rruleConfig: { ...state.rruleConfig, [action.field]: action.value },
            };
        }

        case 'RESET':
            return initialRoutinesFormState;

        default:
            return state;
    }
}
