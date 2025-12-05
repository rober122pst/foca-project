import { generateRefreshToken, generateToken } from './auth.services.js';

import { PrismaClient } from '@prisma/client';
import { generateId } from '../services/generateId.service.js';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

function getExpirationInterval(expiresAt) {
    const now = new Date();
    const diffMs = expiresAt.getTime() - now.getTime();

    // Converte ms para dias
    const diffDays = diffMs / (1000 * 60 * 60 * 24);

    if (diffDays >= 29) {
        return "30d"; // lembrar de mim
    }

    return "1d"; // sessão curta
}

export async function refresh(req, res) {
    try {
        const { refreshToken } = req.body;
    
        // Ve se tem o refresh
        if (!refreshToken) {
            return res.status(401).json({ message: "Tá sem o refresh token, pai" }); // Vou começar a botar mensagens diferentes kk
        }
    
        // Pega lá do banco de dados
        const stored = await prisma.refreshToken.findUnique({
            where: { token: refreshToken },
        });
    
        if (!stored) {
            return res.status(401).json({ message: "Refresh token inválido 😂" });
        }
    
        // Agora ve se tá expirado ou não
        if (stored.expiresAt < new Date()) {
            await prisma.refreshToken.delete({ where: { token: refreshToken } }) // Se tá expirado tem que deletar né k
            return res.status(401).json({ message: "Token expirado lmao" });
        }
    
        // Agora é pra verficar a assinatura
        try {
            jwt.verify(refreshToken, process.env.REFRESH_SECRET);
        } catch (error) {
            await prisma.refreshToken.delete({ where: { token: refreshToken } }); // Deleta ser for invalida
            return res.status(401).json({ message: "Token inválido, irmão" });
        }
    
        // Invalida o refresh atual pra ngm roubar
        await prisma.refreshToken.deleteMany({
            where: { token: refreshToken },
        });
    
        const expiresAt = getExpirationInterval(stored.expiresAt);
    
        // Agora cria outro
        const newRefreshToken = generateRefreshToken(expiresAt);
    
        const decoded = jwt.decode(newRefreshToken);
    
        await prisma.refreshToken.create({
            data: {
                id: generateId(),
                token: newRefreshToken,
                userId: stored.userId,
                expiresAt: new Date(decoded.exp * 1000),
            },
        });
    
        // Gera um token novo de acesso
        const newAccessToken = generateToken(stored.userId);
    
        return res.json({ accessToken: newAccessToken, refreshToken: newRefreshToken });
    } catch (error) {
        res.status(500).json({ message: "Erro inesperado", error });
        console.log(error);
    }
}