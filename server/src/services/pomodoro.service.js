/**
 * Feito pelo GEMINI
 * Calcula os blocos de foco e intervalos.
 * @param {number} tempoTotal - Tempo total disponível em minutos.
 * @returns {object} Objeto contendo o array de blocos e número de intervalos.
 */
export function calcularBlocosFoco(tempoTotal) {
    const PREFERENCIA = 25;
    const MINIMO = 15;
    const MAXIMO = 30;

    // 1. Tenta achar o número de blocos ideal (baseado em 25min)
    let quantidadeBlocos = Math.round(tempoTotal / PREFERENCIA);

    // Se arredondar para 0 (ex: 10 min), força pelo menos 1 bloco
    if (quantidadeBlocos === 0) quantidadeBlocos = 1;

    // 2. Ajusta para respeitar os limites (15min a 30min)
    let tempoMedio = tempoTotal / quantidadeBlocos;

    // Se os blocos ficarem muito pequenos (<15), diminui a quantidade de blocos (aumenta o tempo deles)
    while (tempoMedio < MINIMO && quantidadeBlocos > 1) {
        quantidadeBlocos--;
        tempoMedio = tempoTotal / quantidadeBlocos;
    }

    // Se os blocos ficarem muito grandes (>30), aumenta a quantidade de blocos (diminui o tempo deles)
    while (tempoMedio >= MAXIMO) {
        quantidadeBlocos++;
        tempoMedio = tempoTotal / quantidadeBlocos;
    }

    // 3. Distribuição do tempo (lidando com divisão não exata)
    // Ex: 55 min / 2 blocos = 27.5 -> Math.floor dá 27 de base. Sobra 1.
    const tempoBase = Math.floor(tempoTotal / quantidadeBlocos);
    let resto = tempoTotal % quantidadeBlocos;

    const blocos = [];

    for (let i = 0; i < quantidadeBlocos; i++) {
        // Se ainda tem 'resto', adiciona 1 minuto a este bloco
        // Isso garante que alguns blocos sejam ligeiramente maiores que outros
        let tempoDesteBloco = tempoBase;

        if (resto > 0) {
            tempoDesteBloco += 1;
            resto--;
        }
        blocos.push(tempoDesteBloco);
    }

    // O número de intervalos é sempre a quantidade de blocos - 1 (se houver mais de 1 bloco)
    const qtdIntervalos = quantidadeBlocos > 1 ? quantidadeBlocos - 1 : 0;

    return {
        tempoTotal: tempoTotal,
        blocks: blocos, // Array com o tempo de cada bloco (ex: [28, 27])
        totalCycles: qtdIntervalos,
    };
}