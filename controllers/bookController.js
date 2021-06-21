const { mongoose } = require('mongoose');
const BookModel = require('../models/Book')
const CustomError = require('../models/cutomError')

const getBooks = async (req, res, next) => {
    BookModel.find({}, (err, doc) => {
        if (err) {
            console.log("Error: ", err.message);
            next(new CustomError(500, "Internal Server Error!"));
        } else {
            res.send(doc);
        }
    })
}

const getBookByTitle = async (req, res, next) => {
    BookModel.find({ title: req.params['title'] }, (err, doc) => {
        if (err) {
            console.log("Error: ", err.message);
            next(new CustomError(500, "Internal Server Error!"));
        } else {
            res.send(doc);
        }
    })
}

const addBook = async (req, res, next) => {

    if (!req.body) {
        next(new CustomError(400, "Bad Request"));
    }
    else {
        const book = new BookModel(req.body);
        book.save((err, doc) => {
            if (err) {
                console.log(err.message);
                next(new CustomError(400, "Bad Request"));
            } else {
                res.statusCode = 201;
                res.send(doc);
            }
        });
    }
}

const deleteBook = async (req, res, next) => {
    const id = req.params['id'];

    BookModel.findOne({ _id: id }, (err, doc) => {
        if (err) {
            next(new CustomError(404, "No Element Found"))
        } else {
            BookModel.remove({ _id: id }, (err) => {
                if (err) {
                    next(new CustomError(500, "Internal Server Error"))
                } else {
                    res.statusCode = 202;
                    res.send(doc);
                }
            })
        }
    })
}

const updateBook = async (req, res, next) => {
    if (!req.body) {
        next(new CustomError(400, "Bad Request"));
    }
    else {
        const id = req.params['id'];
        const book = req.body;

        if (id !== book._id) {
            next(new CustomError(404, "ID not match"));
        } else {
            BookModel.findOne({ _id: id }, (err, doc) => {
                if (err) {
                    next(new CustomError(404, "No Element Found"))
                } else {

                    doc.title = book.title;
                    doc.description = book.description;
                    doc.author = book.author;
                    doc.rate = book.rate;

                    doc.save((err, doc) => {
                        if (err) {
                            next(new CustomError(500, "Internal Server Error"))
                        } else {
                            res.statusCode = 202;
                            res.send(doc);
                        }
                    })
                }
            })
        }
    }
}

module.exports = {
    getBooks,
    getBookByTitle,
    addBook,
    deleteBook,
    updateBook,
}