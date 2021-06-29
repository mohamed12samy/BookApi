const CustomError = require('../models/cutomError')
const jwt = require('jsonwebtoken');

const checkAuthentication = (req, res, next) => {
    const token = req.headers['api_token'];
    jwt.verify(token, 'secret', function (err, decoded) {
        if (err){
            console.log("-----------------------",err)
            res.send(err)
            next(new CustomError(401, "Bad Token"));
        }
        else{
            console.log("__________", decoded, "\n-------", token)

            req.decoded = decoded;
            req.token = token;
            next();
        }
    });
}

module.exports = checkAuthentication;