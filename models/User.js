const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name:{ type: String, required:true, maxLength:50},
    email: { type: String, required: true,  maxLength: 150 },
    address: { type: Object, required:false},
    password: { type: String, required: true, minLength: 8, maxLength: 215 },
    favouriteBooks: [{BookID:{type: mongoose.Types.ObjectId}}]
})

const UserModel = mongoose.model('users', UserSchema);
module.exports = UserModel;
