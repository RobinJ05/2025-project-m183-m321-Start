const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const User = require('../models/user');

function initialize(passport) {
    const authenticateUser = async (username, pwd, done) => {
        try {
            const user = await User.findOne({ where: { username: username } });
            
            if (!user) {
                return done(null, false, { message: 'Authentication failed.' });
            }

            const isValidPassword = await bcrypt.compare(pwd, user.pwd);
            if (!isValidPassword) {
                return done(null, false, { message: 'Authentication failed.' });
            }

            return done(null, user);
        } catch (error) {
            return done(error);
        }
    };

    passport.use(new LocalStrategy({
        usernameField: 'username',
        passwordField: 'pwd'
    }, authenticateUser));

    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser(async (id, done) => {
        try {
            const user = await User.findOne({ where: { id: id } });
            done(null, user);
        } catch (error) {
            done(error);
        }
    });
}

module.exports = initialize;