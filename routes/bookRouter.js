const express = require('express');
const { getBooks, getBookByTitle, addBook, deleteBook, updateBook } = require('../controllers/bookController');

const bookRouter = express.Router();

bookRouter.get('/', getBooks);
bookRouter.get('/:title', getBookByTitle);
bookRouter.post('/', addBook);
bookRouter.delete('/:id', deleteBook);
bookRouter.put('/:id',updateBook);

module.exports = bookRouter;
