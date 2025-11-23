// Comentários em português
export function calculateWeeklyProgress(routines) {
    // Pega o início da semana (segunda-feira)
    const now = new Date();
    const day = now.getDay(); // 0 = domingo, 1 = segunda...
    const diffToMonday = day === 0 ? -6 : 1 - day;

    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() + diffToMonday);
    weekStart.setHours(0, 0, 0, 0);

    // Fim da semana (domingo)
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    weekEnd.setHours(23, 59, 59, 999);

    let totalPossible = 0;
    let totalCompleted = 0;

    routines.forEach((routine) => {
        totalPossible += routine.days.length;
        if (routine.completedDays && routine.completedDays.length > 0) {
            const completedInWeek = routine.completedDays.filter(dateString => {
                const completedDate = new Date(dateString);
                return completedDate >= weekStart && completedDate <= weekEnd;
            })

            totalCompleted += completedInWeek.length;
        }
    });

    return { totalCompleted, totalPossible, rate: totalPossible > 0 ? Math.round((totalCompleted / totalPossible) * 100) : 0 };
}

const weekdayMap = {
    SUN: 0,
    MON: 1,
    TUE: 2,
    WED: 3,
    THU: 4,
    FRI: 5,
    SAT: 6,
};

export function mapWeekdaysToNumbers(days) {
    return days.map(d => weekdayMap[d]);
}

export function calculateRoutineWeeklyPercent(days, completedDays) {
    // Pega o início da semana (segunda-feira)
    const now = new Date();
    const day = now.getDay(); // 0 = domingo, 1 = segunda...
    const diffToMonday = day === 0 ? -6 : 1 - day;

    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() + diffToMonday);
    weekStart.setHours(0, 0, 0, 0);

    // Fim da semana (domingo)
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    weekEnd.setHours(23, 59, 59, 999);

    // 1) Contar quantos dias dessa semana a rotina deveria rodar
    let expected = 0;

    for (let i = 0; i < 7; i++) {
        const dayDate = new Date(weekStart);
        dayDate.setDate(weekStart.getDate() + i);

        const dayNumber = dayDate.getDay(); // número 0–6
        if (days.includes(dayNumber)) {
            expected++;
        }
    }

    // 2) Contar quantos dias ela realmente foi concluída
    let completed = 0;

    completedDays.forEach(dateStr => {
        const d = new Date(dateStr);
        if (d >= weekStart && d <= weekEnd) {
            completed++;
        }
    });

    if (expected === 0) return 0;

    // 3) Porcentagem
    return { completed, expected, rate: (completed / expected) * 100 };
}

export function checkRoutineToday(days, completedDays) {
    const now = new Date();
    const day = now.getDay();;

    // 1) Verifica se a rotina deveria ocorrer hoje
    const shouldDoToday = days.includes(day);

    // 2) Verifica se a rotina já foi concluída hoje
    const didToday = completedDays.some(dateStr => {
        const d = new Date(dateStr);
        
        return (
            d.getDate() === day.getDate() &&
            d.getMonth() === day.getMonth() &&
            d.getFullYear() === day.getFullYear()
        );
    });

    return {
        shouldDoToday,
        didToday,
    };
}