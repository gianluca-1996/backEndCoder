const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    /**
     * http y debug se muestran solo si la app se inicia sin argumentos: npm start
     * si la app se inicia con el argumento 'prod' entonces no se podran ver debido a
     * la jerarquia de niveles
     */
    req.logger.http('Este es un mensaje de ejemplo en el nivel http');
    req.logger.debug('Este es un mensaje de ejemplo en el nivel debug');
    req.logger.info('Este es un mensaje de ejemplo en el nivel info');
    req.logger.warning('Este es un mensaje de ejemplo en el nivel warning');
    req.logger.fatal("Este es un mensaje de ejemplo en el nivel fatal");
    res.send('ok');
});

module.exports = router;