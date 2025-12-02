// Feito pelo Gemini

import { RRule } from 'rrule';

const shortDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
const shortMonths = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

export const getShortRecurrence = (rule) => {
    if (!rule) return 'Data única';

    const options = rule.options;
    const freq = options.freq;
    const interval = options.interval || 1;

    // Preparar sufixo de "Até" (se existir data final)
    let untilText = '';
    if (options.until) {
        const date = options.until;
        const day = date.getDate();
        const month = shortMonths[date.getMonth()];
        const year = date.getFullYear() !== new Date().getFullYear() ? ` ${date.getFullYear()}` : ''; // Só mostra ano se não for o atual
        untilText = ` até ${day} de ${month}${year}`;
    }

    // --- LÓGICA DE FORMATAÇÃO CURTA ---

    // 1. Caso: Diário (FREQ=DAILY)
    if (freq === RRule.DAILY) {
        const text = interval === 1 ? 'Todos os dias' : `A cada ${interval} dias`;
        return text + untilText;
    }

    // 2. Caso: Semanal (FREQ=WEEKLY)
    if (freq === RRule.WEEKLY) {
        // Se tiver intervalo > 1 (ex: A cada 2 semanas) precisamos mostrar
        const prefix = interval === 1 ? '' : `A cada ${interval} semanas: `;

        // Pega os dias da semana (ex: [0, 2] = Seg, Qua)
        // Nota: byweekday retorna objetos ou inteiros dependendo da versão, garantimos o tratamento
        let daysList = [];
        if (options.byweekday && options.byweekday.length > 0) {
            // Ordena os dias (0 = Seg no RRule JS padrão, mas array começa em 0=Dom no nosso shortDays. Ajuste necessário)
            // RRule: 0=Mon, 1=Tue... 6=Sun.
            // shortDays: 0=Dom, 1=Seg...

            daysList = options.byweekday.map((dayObj) => {
                // RRule dia 0 é Segunda. O nosso shortDays 1 é Segunda.
                // Vamos converter o integer do RRule para o index do nosso array PT
                const rruleDay = typeof dayObj === 'number' ? dayObj : dayObj.weekday;

                // Mapeamento RRule (0=Seg) -> Date (1=Seg)
                // RRule: 0(Mo), 1(Tu), 2(We), 3(Th), 4(Fr), 5(Sa), 6(Su)
                // Date.getDay(): 0(Su), 1(Mo)...
                const mapToJsDay = [1, 2, 3, 4, 5, 6, 0];
                return shortDays[mapToJsDay[rruleDay]];
            });
        }

        // Se selecionou todos os dias da semana (Seg a Dom)
        if (daysList.length === 7)
            return (interval === 1 ? 'Todos os dias' : 'A cada ' + interval + ' semanas') + untilText;

        // Se for dias úteis (Seg, Ter, Qua, Qui, Sex)
        const isWeekDays = daysList.length === 5 && !daysList.includes('Sáb') && !daysList.includes('Dom');
        if (isWeekDays) return prefix + 'Dias úteis' + untilText;

        // Caso padrão: "Seg, Qua, Sex"
        return prefix + daysList.join(', ') + untilText;
    }

    // 3. Caso: Mensal (FREQ=MONTHLY)
    if (freq === RRule.MONTHLY) {
        // Se for por dia do mês (ex: dia 15)
        if (options.bymonthday) {
            const days = Array.isArray(options.bymonthday) ? options.bymonthday.join(', ') : options.bymonthday;
            return `Dia ${days} do mês` + untilText;
        }
        return 'Mensalmente' + untilText;
    }

    // Fallback para o texto longo automático se for algo muito complexo (ex: Anual)
    return 'Recorrente' + untilText;
};
