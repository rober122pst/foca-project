import pkg from 'rrule';

const { RRule } = pkg;

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

export async function getEventsService(prisma, options) {
    const where = {
        profile: { userId: options.userId } // Garante filtro por usuário base
    };

    // Filtrar tipos múltiplos
    if (options.types && options.types.length > 0) {
        where.type = { in: options.types };
    }

    // Configurar datas de início e fim do dia
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(startOfDay);
    endOfDay.setHours(23, 59, 59, 999);

    if (options.today) {
        // A Lógica muda aqui:
        // Precisamos de eventos que começam hoje (simples)
        // OU eventos que têm recorrência e começaram antes do fim de hoje
        where.OR = [
            // Caso 1: Eventos normais (sem rrule) ou recorrentes que começam EXATAMENTE hoje
            {
                dtstart: {
                    gte: startOfDay,
                    lte: endOfDay,
                },
            },
            // Caso 2: Eventos recorrentes que começaram no passado
            {
                AND: [
                    { rrule: { not: null } },      // Tem regra de recorrência
                    { rrule: { not: "" } },        // Regra não está vazia
                    { dtstart: { lte: endOfDay } } // Começou antes ou hoje
                ]
            }
        ];
    }

    // 1. Busca no banco (Traz mais eventos do que precisa, pois traz todos os recorrentes passados)
    const events = await prisma.event.findMany({ where });

    // Se não for filtro de "hoje", retorna direto (ou aplica lógica padrão)
    if (!options.today) {
        return events;
    }

    // 2. Filtragem fina no JavaScript para processar o RRULE
    const todayEvents = events.filter(event => {
        // Se não tem recorrência, o filtro do banco já garantiu que é hoje
        if (!event.rrule) return true;

        // Se tem recorrência, precisamos calcular
        try {
            // Importante: O RRule precisa saber a data original de início (dtstart)
            // para calcular as recorrências corretamente baseadas nela.
            const ruleOptions = RRule.parseString(event.rrule);
            
            // Ajusta o dtstart na regra para bater com o do evento
            ruleOptions.dtstart = new Date(event.dtstart);

            const rule = new RRule(ruleOptions);

            // Verifica se existe alguma ocorrência entre o inicio e fim de hoje
            // O 'between' retorna um array de datas. Se > 0, o evento ocorre hoje.
            const occurrencesToday = rule.between(startOfDay, endOfDay, true); // true = inc (inclusivo)

            return occurrencesToday.length > 0;
        } catch (error) {
            console.error(`Erro ao processar RRULE do evento ${event.id}:`, error);
            return false; // Se der erro na regra, ignora o evento
        }
    });

    return todayEvents;
}
