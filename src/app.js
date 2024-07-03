const express = require('express');
const dotenv = require('dotenv');
dotenv.config();
require('./config/mongoose.config.js');
const productRouter = require('./routes/productRouter.js');
const cartsRouter = require('./routes/cartRouter.js');
const userRouter = require('./routes/userRouter.js');
const passport = require('passport');
const initializePassportJwt = require('./config/passport.config.js');
const app = express();
const PORT = 8080;
const cookieParser = require('cookie-parser');
app.listen(PORT, () => console.log(`Servidor escuchando en el puerto: ${PORT}`));

app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(cookieParser());
initializePassportJwt();
app.use(passport.initialize());

app.use('/api/products', productRouter);
app.use('/test', (req, res) => res.json( {result: 'success'} ));
app.use('/api/carts', cartsRouter);
app.use('/api/user', userRouter);
/*app.use('/api/session', sessionRouter);
app.use('/views', viewsRouter);
*/
app.use(express.static(__dirname + '/public'));