const express = require('express');
const bookRouter = require('./bookRouter');
const userRouter = require('./userRouter');

const apiRouter = express.Router();

apiRouter.use('/book', bookRouter);
apiRouter.use('/user', userRouter);


module.exports = apiRouter;