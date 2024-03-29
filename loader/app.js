//Require Express
const express = require('express');

//Require geh
const geh = require('../api/geh')

//Require CORS
const cors = require('cors')

//Get routers
const alumniRouter = require('../api/alumni/router');
const adminRouter = require('../api/admin/router');
const headRouter = require('../api/head/router');
const loginRouter = require('../api/login/router');
const guestRouter = require('../api/guest/router')

//Create app
const app = express();


//Add cors for api use in frontend
app.use(cors())


//Add in the body parser
app.use(express.json());
app.use(express.urlencoded({ extended: false }));


//Use routers
app.use('/api/v1/alumni',alumniRouter);
app.use('/api/v1/admin',adminRouter);
app.use('/api/v1/head', headRouter);
app.use('/api/v1/login',loginRouter);
app.use('/api/v1/guest',guestRouter);

//Use global error handler
app.use(geh)

module.exports = app;