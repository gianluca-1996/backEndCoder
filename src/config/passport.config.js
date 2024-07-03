const passport = require('passport');
const jwt = require('passport-jwt');

//estrategia passport-jwt
const JWTStrategy = jwt.Strategy; //core de la estrategia jwt
const ExtractJwt = jwt.ExtractJwt; //extractor de jwt (headers, body, cookies)
const initializePassportJwt = () => {
    passport.use('jwt', new JWTStrategy({ 
        jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
        secretOrKey: process.env.JWT_SECRET
    }, async (jwt_payload, done) => {
        try {
            done(null, jwt_payload);
        } catch (error) {
            done(error);
        }
    }))
}

//cookie extractor: manera en que extrae el token (headers, body, cookies)
const cookieExtractor = req => {
    let token = null;
    if(req && req.cookies)  token = req.cookies[process.env.COOKIE_SECRET];

    return token;
}

module.exports = initializePassportJwt;