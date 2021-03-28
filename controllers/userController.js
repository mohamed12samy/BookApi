const mongoose  = require('mongoose');
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
                next(new CustomError(404, "user is already exists"));
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
                                    const { _id, name, email, favouriteBooks } = doc;
                                    jwt.sign({ id: doc._id }, 'secret', {
                                        expiresIn: 86400
                                    }, (err, token) => {
                                        if (!err) {
                                            res.statusCode = 201;
                                            res.send({ _id, name, email, favouriteBooks, token });
                                        }
                                    });
                                }
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

                    if (!valid) next(new CustomError(400, "Bad Credentials, User doesn't exist"));
                    else {
                        const { _id, name, email, favouriteBooks } = doc;
                        jwt.sign({ id: doc._id }, 'secret', {
                            expiresIn: 86400
                        }, (err, token) => {
                            if (!err) {
                                res.statusCode = 201;
                                res.send({ _id, name, email, favouriteBooks, token });
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

const getProfile = async(req,res,next)=>{
    const token = req.headers['api_token'];

    let decoded;
    try {
        decoded = await jwt.verify(token, 'secret');

        let user = await UserModel.findById(decoded.id);

        if(user){
            const {_id, name, email, favouriteBooks, token} = user;
            
            res.statusCode = 200;
            res.send({_id, name, email, favouriteBooks, token});
        }

    }catch (e) {
        console.log(e)
        return next(new CustomError(401, "Bad Token"));
    }
}

//api/user/favbooks
const getUserFavourites = async (req, res, next) => {
    const token = req.headers['api_token'];
    jwt.verify(token, 'secret', function (err, decoded) {
        if (err)
            next(new CustomError(401, "Bad Token"));
        else {

            UserModel.findOne({ _id: decoded.id }, (err, doc) => {
                if (err) {
                    next(new CustomError(500, "Internal Server Error"));

                } else {
                    res.statusCode = 200;
                    res.send(doc.favouriteBooks);
                }
            })
        }
    });
}

//api/user/favbooks
const setFavourites = async (req, res, next) => {
    const token = req.headers['api_token'];
    let decoded;
    try {
        decoded = await jwt.verify(token, 'secret');

        const favId = req.params['id'];
        let user = await UserModel.findById(decoded.id);
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
    } catch (e) {
        console.log(e)
        return next(new CustomError(401, "Bad Token"));
    }
    console.log(decoded);
}
//api/user/favbooks
const deleteFromFavourites = async (req, res, next) => {
    const token = req.headers['api_token'];

    let decoded;
    try {
        decoded = await jwt.verify(token, 'secret');

        const deleteId = req.params['id'];
        let user = await UserModel.findById(decoded.id);
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
    } catch (e) {
        console.log(e)
        return next(new CustomError(401, "Bad Token"));
    }
}

module.exports = {
    register,
    login,
    logout,
    getProfile,
    getUserFavourites,
    setFavourites,
    deleteFromFavourites
}