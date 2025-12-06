import { Strategy as FacebookStrategy } from 'passport-facebook';
import { Strategy as GoogleStrategy } from 'passport-google-oauth2';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { generateId } from '../services/generateId.service.js';
import passport from 'passport';

const prisma = new PrismaClient();

// login com google
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK,
},
async (_, __, profile, cb) => {
    try {
        console.log(profile)
        const userEmail = profile.emails && profile.emails.length > 0 ? profile.emails[0].value : null;

        // verificar envio do email
        if (!userEmail) {
            return cb(new Error("O Google não mandou o enderaço email"));
        }

        //verifica se o email já está cadastrado em uma conta
        const user = await prisma.user.findUnique({ where: { email: userEmail } });

        
        if (user) {
            //se usuario já existe e não tem conta do google, adiciona conta do google ao perfil existente
            if (!user.googleId) {
                await prisma.user.update({
                    where: { id: user.id },
                    data: { googleId: profile.id }, 
                });
            }
            return cb(null, user);
        } else { 
            //se não existe conta do usuario, cria nova conta do usuario usando dados do google
            const newPassword = await bcrypt.hash(`google-profile-${profile.id}`, 10);
            const newUser = await prisma.user.create({
                data: {
                    id: generateId(),
                    googleId: profile.id,
                    name: profile.displayName,
                    email: profile.emails[0].value,
                    password: newPassword,
                    profile: { create: {
                        id: generateId(),
                        picUrl: profile.photos[0].value || '',
                        gamefication: { create: {
                            id: generateId(),
                        } }
                    } },
                    config: { create: {
                        id: generateId(),
                    } }
                },
            });

            return cb(null, newUser);
        }

    // mensagem de erro em caso de falha no login
    } catch (error) {
        console.log(error)
        return cb(error, null);
    }
}));


// login com Facebook
passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID || 'o', 
    clientSecret: process.env.FACEBOOK_APP_SECRET || 'b',
    callbackURL: process.env.FACEBOOK_CALLBACK || 'o',
    profileFields: ['id', 'displayName', 'name', 'email', 'photos']
}, async (accessToken, refreshToken, profile, cb) => {
    try {
        console.log(profile)
        const userEmail = profile.emails && profile.emails.length > 0 ? profile.emails[0].value : null;

        // verifica envio do email
        if (!userEmail) {
            return cb(new Error("Facebook não mandou um endereço de email."));
        }

        //verifica se o email já está cadastrado em uma conta
        const user = await prisma.user.findUnique({ where: { email: userEmail } });

        if (user) {
            //se usuario já existe e não tem conta do facebook, adiciona conta do facebook ao perfil existente
            if (!user.facebookId) {
                await prisma.user.update({ 
                    where: { id: user.id },
                    data: { facebookId: profile.id }, 
                });
            }
            return cb(null, user);
        } else { 
            //se não existe conta do usuario, cria nova conta do usuario usando dados do facebook
            const newPassword = await bcrypt.hash(`facebook-profile-${profile.id}`, 10);
            const newUser = await prisma.user.create({
                data: {
                    id: generateId(),
                    facebookId: profile.id,
                    name: profile.displayName,
                    email: profile.emails[0].value,
                    password: newPassword,
                    profile: { create: {
                        id: generateId(),
                        picUrl: profile.photos[0].value || '',
                        gamefication: { create: {
                            id: generateId(),
                        } }
                    } },
                    config: { create: {
                        id: generateId(),
                    } }
                },
            });

            return cb(null, newUser);
        }
    
    // mensagem de erro em caso de falha no login
    } catch (error) {
        console.log(error)
        return cb(error, null);
    }
}));
// Salva os dados do usuário
passport.serializeUser((user, done) => {
    done(null, user);
});
// Recupera os dados do usuário armazenados
passport.deserializeUser((user, done) => {
    done(null, user);
});

export default passport;