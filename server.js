'use strict';

// Set environment variables
const dotenv = require('dotenv');
dotenv.config();

// App dependencies
const app = require('./server/app').app;

// Start listening
app.listen(process.env.PORT, ()=> {
    console.log(`Express server started at port ${process.env.PORT}`);
});
