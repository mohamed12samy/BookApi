const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name:{ type: String, required:true, max:50},
    email: { type: String, required: true,  max: 150 },
    address: { type: Object, required:false},
    password: { type: String, required: true, min: 8, max: 215 },
    favouriteBooks: [{BookID:{type: mongoose.Types.ObjectId}}]
})

const UserModel = mongoose.model('Users', UserSchema);
module.exports = UserModel;
