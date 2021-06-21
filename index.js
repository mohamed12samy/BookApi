const express = require('express');
const { port } = require('./config.json');
const CustomError = require('./models/cutomError');
const initMongoose = require('./mongoose/Mongoose');
const apiRouter = require('./routes/apiRouter');
const cors = require('cors')

const app = express();




(async function(){ 
   await initMongoose();
})();


app.use(cors(/*{
  allowedHeaders:'api_token',
  exposedHeaders:['api_token']
}*/));

app.use(express.json());

app.use('/api', apiRouter);


app.use('*/*', (req,res,next)=>{
    next(new CustomError(404, "Not Found"))
})

app.use((err, req, res, next) => {
    res.statusCode = err.statusCode;
    res.send({message:err.message});
  });
  


app.listen(port,()=>{})