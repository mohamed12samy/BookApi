const express = require('express');
const {register,updateUser,deleteUser,login,logout,getUsers,getUserById, getProfile, getUserFavourites, setFavourites, deleteFromFavourites} = require('../controllers/userController');
const checkAuthentication = require('../middlewares/checkAuthentication');

const userRouter = express.Router();

userRouter.post('/register',register);
userRouter.post('/login',login);
userRouter.post('/logout',checkAuthentication,logout);
userRouter.put('/',checkAuthentication,updateUser);
userRouter.get('/users',getUsers);
userRouter.delete('/:id',checkAuthentication,deleteUser);
userRouter.get('/',checkAuthentication,getProfile);
userRouter.get('/:id',getUserById);


userRouter.get('/favbooks',checkAuthentication,getUserFavourites);
userRouter.post('/favbooks/:id',checkAuthentication,setFavourites);
userRouter.delete('/favbooks/:id',checkAuthentication,deleteFromFavourites);

module.exports = userRouter;