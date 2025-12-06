import jwt from 'jsonwebtoken';

// Gera token de acesso
export function generateToken(userId) {
    return jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: '15m',
    });
}

// Gera refresh token por 30 dias
export function generateRefreshToken(expiresIn = '30d') {
    return jwt.sign({}, process.env.REFRESH_SECRET, {
        expiresIn: expiresIn,
    })
};
