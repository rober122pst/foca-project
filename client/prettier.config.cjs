// prettier.config.cjs
module.exports = {
    plugins: [import('prettier-plugin-tailwindcss')],
    semi: true, // exige ponto e vírgula
    singleQuote: true, // usa aspas simples
    tabWidth: 4, // indentação de 2 espaços
    trailingComma: 'es5', // vírgula no final de objetos e arrays
    printWidth: 80, // limite de caracteres por linha
    bracketSpacing: true, // deixa espaço dentro de { }
};
