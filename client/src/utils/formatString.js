export function localeNumber(number, isDecimal = false) {
    return number.toLocaleString('pt-BR', { minimumFractionDigits: isDecimal ? 2 : 0 });
}
