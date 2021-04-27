const express = require('express');
const {register,login,logout, getProfile, getUserFavourites, setFavourites, deleteFromFavourites} = require('../controllers/userController');
const checkAuthentication = require('../middlewares/checkAuthentication');

const userRouter = express.Router();

userRouter.post('/register',register);
userRouter.post('/login',login);
userRouter.post('/logout',checkAuthentication,logout);
userRouter.get('/',checkAuthentication,getProfile);

userRouter.get('/favbooks',checkAuthentication,getUserFavourites);
userRouter.post('/favbooks/:id',checkAuthentication,setFavourites);
userRouter.delete('/favbooks/:id',checkAuthentication,deleteFromFavourites);

module.exports = userRouter;