export function formatMinutesToHourString(totalMinutes) {
    // converte pra horas (decimal)
    const hoursDecimal = totalMinutes / 60;

    // se for mais de 100 horas, retorna decimal
    if (hoursDecimal >= 100) {
        // toFixed(1) deixa uma casa decimal (100.5, 120.3...)
        return `${hoursDecimal.toFixed(1)}h`;
    }

    // caso normal: horas + minutos bonitinhos
    const hours = Math.floor(hoursDecimal);
    const minutes = totalMinutes % 60;

    return `${hours}h${minutes.toString().padStart(2, '0')}`;
}

export function toUTCISOTimeOnly(timeString) {
    const [hour, minute] = timeString.split(':').map(Number);

    // Sempre cria no dia 1 de janeiro de 1970
    const date = new Date('1970-01-01T00:00:00');

    // Aplica a hora escolhida
    date.setHours(hour, minute, 0, 0);

    // Retorna o ISO UTC
    return date.toISOString();
}

export function formatHours(dateTime) {
    return new Intl.DateTimeFormat('pt-BR', {
        hour: '2-digit',
        minute: '2-digit',
    }).format(new Date(dateTime));
}
