const passport = require('passport');

// Middleware for user authentication
const authenticateUser = (req, res, next) => {
    passport.authenticate('jwt', { session: false }, (err, user) => {
        if (err || !user) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        req.user = user;
        next();
    })(req, res, next);
};

module.exports = {
    authenticateUser: authenticateUser,
};
