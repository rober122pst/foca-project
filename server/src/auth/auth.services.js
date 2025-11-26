import jwt from 'jsonwebtoken';

export function generateToken(userId) {
    return jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: '15m',
    });
}

export function generateRefreshToken(expiresIn = '30d') {
    return jwt.sign({}, process.env.REFRESH_SECRET, {
        expiresIn: expiresIn,
    })
};
