const express = require('express');
const {register,login,logout, getProfile, getUserFavourites, setFavourites, deleteFromFavourites} = require('../controllers/userController');

const userRouter = express.Router();

userRouter.post('/register',register);
userRouter.post('/login',login);
userRouter.post('/logout',logout);
userRouter.get('/',getProfile);

userRouter.get('/favbooks',getUserFavourites);
userRouter.post('/favbooks/:id',setFavourites);
userRouter.delete('/favbooks/:id',deleteFromFavourites);


module.exports = userRouter;