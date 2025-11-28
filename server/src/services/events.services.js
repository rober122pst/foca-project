// Comentários em português
export function calculateWeeklyProgress(events) {
    // Pega o início da semana (domingo)
    const now = new Date();
    const day = now.getDay(); // 0 = domingo, 1 = segunda...
    const diffToSunday = 0 - day;

    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() + diffToSunday);
    weekStart.setHours(0, 0, 0, 0);

    // Fim da semana (sabado)
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    weekEnd.setHours(23, 59, 59, 999);

    let totalPossible = 0;
    let totalCompleted = 0;

    events.forEach((event) => {
        totalPossible += event.days.length;
        if (event.completedDays && event.completedDays.length > 0) {
            const completedInWeek = event.completedDays.filter(dateString => {
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

export function calculateEventWeeklyPercent(days, completedDays) {
     // Pega o início da semana (domingo)
    const now = new Date();
    const day = now.getDay(); // 0 = domingo, 1 = segunda...
    const diffToSunday = 0 - day;

    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() + diffToSunday);
    weekStart.setHours(0, 0, 0, 0);

    // Fim da semana (sabado)
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    weekEnd.setHours(23, 59, 59, 999);

    // Contar quantos dias dessa semana a rotina deveria rodar
    let expected = days.length;

    // 2) Contar quantos dias ela realmente foi concluída
    let completed = 0;

    if (completedDays && completedDays.length > 0) {
        const completedInWeek = completedDays.filter(dateString => {
            const completedDate = new Date(dateString);
            return completedDate >= weekStart && completedDate <= weekEnd;
        })

        completed = completedInWeek.length;
    }

    // 3) Porcentagem
    return { completed, expected, rate: expected > 0 ? Math.round((completed / expected) * 100) : 0 };
}

export function checkEventToday(days, completedDays) {
    const now = new Date();
    const day = now.getDay();

    // 1) Verifica se a rotina deveria ocorrer hoje
    const shouldDoToday = days.includes(day);

    // 2) Verifica se a rotina já foi concluída hoje
    const didToday = completedDays.some(dateStr => {
        const d = new Date(dateStr);
        
        return (
            d.getDate() === now.getDate() &&
            d.getMonth() === now.getMonth() &&
            d.getFullYear() === now.getFullYear()
        );
    });

    return {
        shouldDoToday,
        didToday,
    };
}