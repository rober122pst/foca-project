export function xpToNext(level) {
    // return Math.round(150 * (1.1 ** (level - 1)));
    // return Math.round(150 + (1.8 * (level**2)));
    return Math.round(200 * (1.03 ** (level - 1)) + 100 * level);
}

for (let i = 1; i <= 100; i++ ) {
    console.log(`Nivel: ${i}, XP: ${xpToNext(i)}`)
}