const express = require('express');
const { getBooks, getBookByTitle, addBook, deleteBook, updateBook } = require('../controllers/bookController');
const checkAuthentication = require('../middlewares/checkAuthentication');

const bookRouter = express.Router();

bookRouter.get('/', getBooks);
bookRouter.get('/:title',checkAuthentication, getBookByTitle);
bookRouter.post('/',checkAuthentication, addBook);
bookRouter.delete('/:id',checkAuthentication, deleteBook);
bookRouter.put('/:id',checkAuthentication,updateBook);

module.exports = bookRouter;
