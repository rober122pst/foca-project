// prettier.config.cjs
module.exports = {
    plugins: [import('prettier-plugin-tailwindcss')],
    jsxBracketSameLine: false,
    bracketSameLine: false,
    // Force LF line endings to avoid CR (\r) insertion on Windows
    endOfLine: 'lf',
};
