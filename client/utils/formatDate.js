export function weekDaysToString(days) {
    const daysStr = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
    return days.map((day) => daysStr[day]);
}
