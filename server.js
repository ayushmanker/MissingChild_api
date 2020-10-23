const express=require("express");
const dotenv=require("dotenv");
const connectDB=require('./config/db');
const morgan = require('morgan');
const errorHandler = require('./middleware/error');
const fileupload = require('express-fileupload');
const path = require('path');
const cookieParser = require('cookie-parser');


//load env vars
dotenv.config({path:'./config/config.env'});

//Connect to database
connectDB();  

//Route files
const mchild = require('./routes/mchild');
const user = require('./routes/user');
const auth = require('./routes/auth');


app = express();

//body parser to use req.body in controllers , we use a middlware
app.use(express.json());

//cookie parser
app.use(cookieParser());

//File uploading
app.use(fileupload());

//to print the url/route in console
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev')); 
}

//Set public as static folder
app.use(express.static(path.join(__dirname, 'public')));

//mount routers
app.use('/api/v1/mchild',mchild);
app.use('/api/v1/user',user);
app.use('/api/v1/auth', auth);


app.use(errorHandler);

const PORT=process.env.PORT || 5000; 
const server = app.listen(PORT,
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);

//Handle unhandled promise rejections i.e. if the server is not able to connect with the database (due to some reason wrong password in the config file etc)
//it will close the server and show err message in the console 
process.on('unhandledRejection',(err,promise) =>{
  console.log(`Error: ${err.message}`);
  //Close server & exit process
  server.close( ()=> process.exit(1) );
});