import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth2';
import { Strategy as FacebookStrategy } from 'passport-facebook';


const prisma = new PrismaClient();

export async function register(req, res) {
    const { name, email, password, confirmPassword, acceptTerms } = req.body;

    if (!name || !email || !password || !confirmPassword) {
        return res
            .status(400)
            .json({ message: 'Todos os campos são obrigatórios' });
    }
    if (name.length < 3 || name.length > 50) {
        return res
            .status(400)
            .json({ message: 'Nickname deve ter entre 3 e 20 caracteres' });
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
        return res.status(400).json({ message: 'Email inválido' });
    }
    if (password.length < 6) {
        return res
            .status(400)
            .json({ message: 'A senha deve ter pelo menos 6 caracteres' });
    }
    if (!/[A-Z]/.test(password)) {
        return res.status(400).json({
            message: 'A senha deve conter pelo menos uma letra maiúscula',
        });
    }
    if (!/[0-9]/.test(password)) {
        return res
            .status(400)
            .json({ message: 'A senha deve conter pelo menos um número' });
    }
    if (!/[a-z]/.test(password)) {
        return res.status(400).json({
            message: 'A senha deve conter pelo menos uma letra minúscula',
        });
    }
    if (password !== confirmPassword) {
        return res.status(400).json({ message: 'As senhas não coincidem' });
    }
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
            return res.status(400).json({ message: 'Email já cadastrado' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
            },
        });

        const token = jwt.sign({ userId: newUser.id }, process.env.JWT_SECRET, {
            expiresIn: '1h',
        });

        res.status(201).json({
            message: 'Usuário registrado com sucesso',
            token,
        });
    } catch (error) {}
}

export async function login(req, res) {
    const { email, password, rememberMe } = req.body;
    try {
        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            return res
                .status(404)
                .json({ message: 'Email ou senha inválidos' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res
                .status(404)
                .json({ message: 'Email ou senha inválidos' });
        }

        const tokenExpiration = rememberMe ? '30d' : '1h';
        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
            expiresIn: tokenExpiration,
        });

        res.json({ token });
    } catch (error) {
        res.status(500).json({ message: 'Erro no servidor' });
    }
}


// login com facebook e google

// login com google
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID || 'CLIENTE-GOOGLE',
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'CLIENT_SECRET_GOOGLE',
    callbackURL: 'http://localhost:3000/auth/auth/google/callback',
},
async (accessToken, refreshToken, profile, cb) => {
    try {
        console.log("conta do google")
        const userEmail = profile.emails && profile.emails.length > 0 ? profile.emails[0].value : null;

        if (!userEmail) {
            return cb(new Error("O Google não mandou o enderaço email"));
        }

        const user = await User.findOne({ email: userEmail });

        if (user) {
            user.name = profile.displayName;
            await user.save();
            return cb(null, user);
        } else {
            const newUser = new User({
                name: profile.displayName,
                email: userEmail,
                googleId: profile.id,
                password: 'social-login-' + Date.now()
            });

            await newUser.save();
            return cb(null, newUser);
        }
    } catch (error) {
        return cb(error);
    }
}));


// login com Facebook
passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID || 'CLIENTE-FACEOOK', 
    clientSecret: process.env.FACEBOOK_APP_SECRET || 'CLIENT-SECRET-FACEBOOK',
    callbackURL: "http://localhost:3000/auth/auth/facebook/callback",
    profileFields: ['id', 'displayName', 'emails']
}, async (accessToken, refreshToken, profile, cb) => {
    try {
        const userEmail = profile.emails && profile.emails.length > 0 ? profile.emails[0].value : null;

        if (!userEmail) {
            return cb(new Error("Facebook não mandou um endereço de email."));
        }

        const user = await User.findOne({ email: userEmail });

        if (user) {
            user.name = profile.displayName;
            await user.save();
            return cb(null, user);
        } else {
            const newUser = new User({
                name: profile.displayName,
                email: userEmail,
                password: 'social-login-' + Date.now() 
            });

            await newUser.save();
            return cb(null, newUser);
        }
    } catch (error) {
        return cb(error);
    }
}));

export default passport;