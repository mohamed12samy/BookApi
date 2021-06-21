const mongoose = require('mongoose');

const BookSchema = new mongoose.Schema({
    title:{ type: String, required:true, max:150},
    description: { type: String, required: true,  max: 250 },
    author: { type: String, required: true, max:50 },
    rate: {type:Number, required:true},
    likedUsers:[{userID:{type: mongoose.Types.ObjectId}}]
})

const BookModel = mongoose.model('books', BookSchema);
module.exports = BookModel;
