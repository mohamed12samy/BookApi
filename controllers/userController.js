const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const UserModel = require('../models/User')
const BookModel = require('../models/Book')
const CustomError = require('../models/cutomError')

const register = async (req, res, next) => {
    if (!req.body) {
        next(new CustomError(400, "All fields are required"));
    } else {
        const body = req.body;
        UserModel.findOne({ email: body.email }, (err, doc) => {
            if (!err && doc) {
                console.log("ERRORR: ", err);
                next(new CustomError(400, "user is already exists"));
            } else {
                const user = new UserModel(body);
                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(body.password, salt, (err, encrepted) => {
                        if (err) {
                            throw new CustomError(500, "Internal server Error")
                        } else {
                            user.password = encrepted;
                            user.save((err, doc) => {
                                if (!err) {
                                    const { _id, name, email, address , favouriteBooks } = doc;
                                    jwt.sign({ id: doc._id, user:doc }, 'secret', {
                                        expiresIn: 86400
                                    }, (err, token) => {
                                        if (!err) {
                                            res.statusCode = 201;
                                            res.send({ _id, name, email, address, favouriteBooks, token });
                                        }
                                    });
                                }else next(new CustomError(400,err))
                            })
                        }
                    })
                })

            }
        })
    }
}

const login = async (req, res, next) => {
    if (!req.body) {
        next(new CustomError(400, "All fields are required"));
    } else {
        const body = req.body;

        UserModel.findOne({ email: body.email }, (err, doc) => {
            if (err) {
                next(new CustomError(400, "Bad Credentials, User doesn't exist"));
            } else if (doc) {
                bcrypt.compare(body.password, doc.password, (err, valid) => {

                    if (!valid) next(new CustomError(401, "Bad Credentials, User doesn't exist"));
                    else {
                        const { _id, name, email,address, favouriteBooks } = doc;
                        jwt.sign({ id: doc._id, user:doc }, 'secret', {
                            expiresIn: 86400
                        }, (err, token) => {
                            if (!err) {
                                res.statusCode = 201;
                                res.send({ _id, name, email,address, favouriteBooks, token });
                            }
                        });
                    }
                });
            } else {
                next(new CustomError(400, "Bad Credentials, User doesn't exist"));
            }
        })
    }
}
const logout = async (req, res, next) => {

}

const getProfile = async (req, res, next) => {
    let user = await UserModel.findById(req.decoded.id);
    const token = req.token;
    if (user) {
        const { _id, name, email,address, favouriteBooks} = user;

        res.statusCode = 200;
        res.send({ _id, name, email,address, favouriteBooks, token });
    }else next(new CustomError(404, "User not found"))
}
const getUsers = async (req, res, next) => {
    let users = await UserModel.find();
    const token = req.token;
    if (users) {
        res.statusCode = 200;
        res.send(users);
    }
}


const getUserById = async (req, res, next) => {
    let user = await UserModel.findById(req.params['id']);
    
    if (user) {
        const { _id, name, email,address, favouriteBooks} = user;
        res.statusCode = 200;
        res.send({ _id, name, email,address, favouriteBooks });
    }else next(new CustomError(404, "User not found"))
}

const updateUser = async (req, res, next) => {
    let user = await UserModel.findById(req.decoded.id);
    const token = req.token;
    const body = req.body;
    if (user) {

        user.name = body.name;
        user.address = body.address;
        user.email = body.email;
        user.save((err,doc)=>{
            if(!err){
                const { _id, name, email,address, favouriteBooks} = doc;
                res.statusCode = 202;
                res.send({ _id, name, email,address, favouriteBooks, token});
            }
        });
    }else next(new CustomError(404,"No User is found"))

}
const deleteUser = async (req, res, next) => {
    let id  = req.params['id'];
    let user = await UserModel.findById(id);
    //const token = req.token;

    if (user) {
        await UserModel.deleteOne({_id:id},(err)=>{
            if(!err){
                res.statusCode = 202;
                res.send({"message":"user deleted"})
            }
        });
    }else next(new CustomError(404,"No User is found"))

}
//api/user/favbooks
const getUserFavourites = async (req, res, next) => {
    const userID = req.decoded.id;
    UserModel.findOne({ _id: userID }, (err, doc) => {
        if (err) {
            next(new CustomError(500, "Internal Server Error"));
        } else {
            res.statusCode = 200;
            res.send(doc.favouriteBooks);
        }
    })
}



//api/user/favbooks
const setFavourites = async (req, res, next) => {
    
        const favId = req.params['id'];
        const userID = req.decoded.id;
        let user = await UserModel.findById(userID);
        if (user) {
            let book = await BookModel.findById(favId)
            if (book) {
                user.favouriteBooks.push(book._id);
                user.save((err, doc) => {
                    if (!err) {
                        res.statusCode = 204;
                        res.send();
                    }
                });
            } else {
                return next(new CustomError(404, "Not Found"));
            }
        }
}
//api/user/favbooks
const deleteFromFavourites = async (req, res, next) => {
        const userID = req.decoded.id;
        const deleteId = req.params['id'];
        let user = await UserModel.findById(userID);
        if (user) {
            console.log(user.favouriteBooks[0])

            console.log(deleteId.localeCompare(user.favouriteBooks[0]._id))
            if (!user.favouriteBooks.some(item => deleteId.localeCompare(item._id) === 0))
                return next(new CustomError(404, "No Liked Books Found"));

            let book = await BookModel.findById(deleteId)
            if (book) {
                const index = user.favouriteBooks.findIndex(item => deleteId.localeCompare(item._id) === 0);
                if (index > -1) {
                    user.favouriteBooks.splice(index, 1);
                    user.save((err, doc) => {
                        if (!err) {
                            res.statusCode = 204;
                            res.send();
                        }
                    });
                }
            } else {
                return next(new CustomError(404, "Not Found"));
            }
        }
   
}

module.exports = {
    register,
    login,
    logout,
    getProfile,
    updateUser,
    deleteUser,
    getUsers,
    getUserById,
    getUserFavourites,
    setFavourites,
    deleteFromFavourites
}