import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import passport from 'passport';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import { Strategy as GoogleStrategy } from 'passport-google-oauth2';
import { generateId } from '../services/generateId.service.js';

const prisma = new PrismaClient();

// login com facebook e google
// login com google
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK,
},
async (_, __, profile, cb) => {
    try {
        console.log("conta do google")
        const userEmail = profile.emails && profile.emails.length > 0 ? profile.emails[0].value : null;

        if (!userEmail) {
            return cb(new Error("O Google não mandou o enderaço email"));
        }

        const user = await prisma.user.findUnique({ where: { email: userEmail } });

        if (user) {
            await prisma.user.update({ 
                where: { id: user.id },
                data: { googleId: profile.id }, 
            });
            return cb(null, user);
        } else {
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
                        picUrl: profile.photos[0].value,
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
    } catch (error) {
        console.log(error)
        return cb(error, null);
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

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((user, done) => {
    done(null, user);
});

export default passport;