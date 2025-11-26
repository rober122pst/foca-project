import { PrismaClient } from '@prisma/client';
import passport from 'passport';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import { Strategy as GoogleStrategy } from 'passport-google-oauth2';

const prisma = new PrismaClient();

// Atualizar as url do backend
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

        const user = await prisma.user.findUnique({ where: { email: userEmail } });

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