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
