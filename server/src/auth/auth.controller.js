import { generateRefreshToken, generateToken } from './auth.services.js';

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { generateId } from '../services/generateId.service.js';

const prisma = new PrismaClient();

export async function register(req, res) {
    const { name, email, password, confirmPassword, acceptTerms } = req.body;

    // Ve se tudo ta preenchido
    if (!name || !email || !password || !confirmPassword) {
        return res
            .status(400)
            .json({ message: 'Todos os campos são obrigatórios' });
    }
    // Verifica se o nickname tem o tamanho certo
    if (name.length < 3 || name.length > 50) {
        return res
            .status(400)
            .json({ message: 'Nickname deve ter entre 3 e 20 caracteres' });
    }
    // Vê se o email é valido com REGEX (vê se tem string + um @ + string + . + string)
    if (!/\S+@\S+\.\S+/.test(email)) {
        return res.status(400).json({ message: 'Email inválido' });
    }
    if (password.length < 6) {
        return res
            .status(400)
            .json({ message: 'A senha deve ter pelo menos 6 caracteres' });
    }
    // REGEX pra saber se a senha tem pelo menos uma letra maiuscula de A até Z
    if (!/[A-Z]/.test(password)) {
        return res.status(400).json({
            message: 'A senha deve conter pelo menos uma letra maiúscula',
        });
    }
    // Mesma coisa pros números
    if (!/[0-9]/.test(password)) {
        return res
            .status(400)
            .json({ message: 'A senha deve conter pelo menos um número' });
    }
    // Agora letra minuscula kk
    if (!/[a-z]/.test(password)) {
        return res.status(400).json({
            message: 'A senha deve conter pelo menos uma letra minúscula',
        });
    }
    if (password !== confirmPassword) {
        return res.status(400).json({ message: 'As senhas não coincidem' });
    }
    // Se aceitou os termos
    if (!acceptTerms) {
        return res
            .status(400)
            .json({ message: 'Você deve aceitar os termos de serviço' });
    }

    try {
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });
        if (existingUser) {
            // Se o user já existir retorna erro
            return res.status(400).json({ message: 'Email já cadastrado' });
        }

        // Deixa a senha criptografada com bcrypt
        const hashedPassword = await bcrypt.hash(password, 10);

        // Cria o user
        const newUser = await prisma.user.create({
            data: {
                id: generateId(),
                name,
                email,
                password: hashedPassword,
                profile: { create: {
                    id: generateId(),
                    gamefication: { create: {
                        id: generateId(),
                    } }
                } },
                config: { create: {
                    id: generateId(),
                } }
            },
        });

        // Salva o token JWT e seu refresh token
        const token = generateToken(newUser.id);
        const refreshToken = generateRefreshToken();

        const decoded = jwt.decode(refreshToken);

        // Salva o refresh token no banco de dados
        await prisma.refreshToken.create({
            data: {
                id: generateId(),
                token: refreshToken,
                userId: newUser.id,
                expiresAt: new Date(decoded.exp * 1000),
            },
        });

        res.status(201).json({
            message: 'Usuário registrado com sucesso',
            accessToken: token,
            refreshToken,
        });
    } catch (error) {
        res.status(500).json({ message: "Erro no servidor" })
        console.log(error)
    }
}

export async function login(req, res) {
    const { email, password, rememberMe } = req.body;
    try {
        const user = await prisma.user.findUnique({
            where: { email },
        });
        // Verifica se o user existe
        if (!user) {
            return res
                .status(404)
                .json({ message: 'Email ou senha inválidos' });
        }
        // Compara a senha que ta criptografada
        const isPasswordValid = await bcrypt.compare(password, user.password);
        // Se for errada, da erro
        if (!isPasswordValid) {
            return res
                .status(404)
                .json({ message: 'Email ou senha inválidos' });
        }

        // Data de expiração do token depende se o user selecionou 'RememberMe'
        const tokenExpiration = rememberMe ? '30d' : '1d';
        // Cria o token jwt
        const token = generateToken(user.id);
        const refreshToken = generateRefreshToken(tokenExpiration);

        const decoded = jwt.decode(refreshToken);

        // Salva o refresh token no banco de dados
        await prisma.refreshToken.create({
            data: {
                id: generateId(),
                token: refreshToken,
                userId: user.id,
                expiresAt: new Date(decoded.exp * 1000),
            },
        });
        
        // Retorna o token
        res.json({ 
            message: 'Logado com sucesso',
            accessToken: token,
            refreshToken,
        });
    } catch (error) {
        res.status(500).json({ message: 'Erro no servidor' });
        console.log(error)
    }
}

// Auth com google
export async function googleAuth(req, res) {
    const token = generateToken(req.user.id);
    const refreshToken = generateRefreshToken('30d');
    res.cookie('token', token, {
        domain: 'foca-project.vercel.app',
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",
        sameSite: "none",
    });
    res.cookie('refreshToken', refreshToken, {
        domain: 'foca-project.vercel.app',
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",
        sameSite: "none",
    });
    const decoded = jwt.decode(refreshToken);
    // Salva o refresh token no banco de dados
    await prisma.refreshToken.create({
        data: {
            id: generateId(),
            token: refreshToken,
            userId: req.user.id,
            expiresAt: new Date(decoded.exp * 1000),
        },
    });
    res.redirect(`${process.env.CLIENT_URL}/auth/callback-handler`);
}

// Auth com facebook
export async function facebookAuth(req, res) {
    const token = generateToken(req.user.id);
    const refreshToken = generateRefreshToken('30d');
    res.cookie('token', token, {
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",
        sameSite: "none",
    });
    res.cookie('refreshToken', refreshToken, {
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",
        sameSite: "none",
    });
    const decoded = jwt.decode(refreshToken);
    // Salva o refresh token no banco de dados
    await prisma.refreshToken.create({
        data: {
            id: generateId(),
            token: refreshToken,
            userId: req.user.id,
            expiresAt: new Date(decoded.exp * 1000),
        },
    });
    res.redirect(`${process.env.CLIENT_URL}/auth/callback-handler`);
}

// Logout usando a remoção do refresh token
export async function logout(req, res) {
    try {
        const { refreshToken } = req.body;

        if (refreshToken) { 
            await prisma.refreshToken.deleteMany({
                where: { token: refreshToken }
            })
        }
        // retorna mensagem confirmando o logout
        return res.json({ message: 'Deslogado com sucesso' })
    } catch (error) {
        return res.json({ message: 'Deslogado com sucesso' })
    }
}
