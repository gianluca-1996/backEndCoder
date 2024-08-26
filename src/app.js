const express = require('express');
const dotenv = require('dotenv');
dotenv.config();
require('./config/mongoose.config.js');
const passport = require('passport');
const initializePassportJwt = require('./config/passport.config.js');
const productRouter = require('./routes/productRouter.js');
const cartsRouter = require('./routes/cartRouter.js');
const userRouter = require('./routes/userRouter.js');
const viewsRouter = require('./routes/viewsRouter.js');
const testLoggerRouter = require('./routes/testLoggerRouter.js');
const {specs, swaggerUiExpress} = require('./config/swagger.config.js');
const app = express();
const PORT = 8080;
const cookieParser = require('cookie-parser');
const addLogger = require('./middlewares/logger.js');

app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(cookieParser());
//initializePassportJwt();
//app.use(passport.initialize());
app.use(addLogger);

app.use('/api/products', productRouter);
app.use('/test', (req, res) => res.json( {result: 'success'} ));
app.use('/api/carts', cartsRouter);
app.use('/api/user', userRouter);
app.use('/views', viewsRouter);
app.use('/loggerTest', testLoggerRouter);
app.use('/apiDocs', swaggerUiExpress.serve, swaggerUiExpress.setup(specs));
app.use(express.static(__dirname + '/public'));

app.listen(PORT, () => console.log(`Servidor escuchando en el puerto: ${PORT}`));