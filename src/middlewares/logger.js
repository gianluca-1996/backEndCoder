const {logger} = require('../utils.js');

const addLogger = (req, res, next) => {
    req.logger = logger,
    req.logger.http(`${req.method} en ${req.url} - ${new Date()}`);
    next();
}

module.exports = addLogger;