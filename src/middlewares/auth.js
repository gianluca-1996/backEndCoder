const jwt = require('jsonwebtoken');
const passport = require('passport');

const passportCall = strategy => {
    return async (req, res, next) => {
        passport.authenticate(strategy, (err, user, info) => {
            if(err) return next(err);
            if(!user) return res.redirect('/views/login');//if(!user) return res.status(401).send({error: info.messages ? info.messages : info.toString()});
            req.user = user;
            next();
        })(req, res, next)
    }
}

const authorization = policies => {
    return async (req, res, next) => {
        if(!req.user) return res.status(401).send({error: 'Unauthorized'});
        if(!policies.includes(req.user.role)) return res.status(403).send({error: 'No permissions'});
        next();
    }
}

const isNotAuthenticated = (req, res, next) => {
    const tokenCookie = req.cookies[process.env.COOKIE_SECRET];
    if(tokenCookie){        
        try {
            jwt.verify(tokenCookie, process.env.JWT_SECRET);
            res.redirect('/views/products');
        } catch (error) {
            return next();
        }
    }
    else return next();
};

module.exports = {isNotAuthenticated, passportCall, authorization};