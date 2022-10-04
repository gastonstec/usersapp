'use strict';

// Set environment variables
const dotenv = require('dotenv');
dotenv.config();
const ERRC = parseInt(process.env.ERRC);   // Error code
const OKC = parseInt(process.env.OKC);     // OK code
const TOKKEY = process.env.TOKKEY;


// Set dependencies
const applib = require('./applib');
const db = require('./db');

// Set json web token
const jwt = require('jsonwebtoken');

// Set express
const path = require('path');
const express = require('express');
const app = new express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
const cors = require('cors');
app.use(cors());
const cookieParser = require('cookie-parser');
app.use(cookieParser());


/* =========== UNPROTECTED ROUTES =========== */

// react client app
// app.get('/client*/:name*', function (req, res, next) {
    
//     console.log('req ', req.url);
//     console.log('req param', req.params);
           
//     var options = {
//       root: path.join(__dirname, '../client'),
//       dotfiles: 'deny',
//       headers: {
//         'x-timestamp': Date.now(),
//         'x-sent': true
//       }
//     };
  
//     let fileName = 'index.html';

//     res.sendFile(fileName, options, function (err) {
//       if (err) {
//         next(err)
//       };
//     });

//   });

// app.get('/client/:name', function (req, res, next) {
    
//     let fileName = req.params.name || '';
//     if (fileName === '' || fileName === undefined) {
//         fileName = 'index.html';
//     };
        
//     var options = {
//       root: path.join(__dirname, '../client'),
//       dotfiles: 'deny',
//       headers: {
//         'x-timestamp': Date.now(),
//         'x-sent': true
//       }
//     };
  
//     console.log(options.root,fileName);
//     res.sendFile(fileName, options, function (err) {
//       if (err) {
//           if (err.status === 404)
//           {
//             res.statusCode = 404;
//             res.end('404 - Page not found');
//           };
//         next(err);
//       };
//     });

//   });

//login
app.post('/user/v1/login', (req, res) => {
    try {
      // Get request parameters
      const { email, password } = req.body;
    
      // Validate user input
      if (!(email && password)) {
        res.status(ERRC).json({result: 'error', message: 'All inputs are required'});
      };

      // Login user
      db.userLogin(req, res);

    } catch (err) {
        console.error(err)   
    };     
});

//signup user
app.post('/user/v1/signup', (req, res) => {
    const { email, fullname, password } = req.body;

    // input validation
    if (!(email && fullname && password)) {
        res.status(ERRC).send('All inputs are required');
    }
    try {
        if (!applib.checkEmail(email)) {
            res.status(ERRC).json({result: 'error', message: 'Email address is invalid'});
        } else if (!applib.checkPassword(password)) {
            res.status(ERRC).json({result: 'error', message: 'Password format is invalid'})
        } else if (!applib.checkFullname(fullname)) {
            res.status(ERRC).json({result: 'error', message: 'Full name length is invalid'})
        } else {
            db.signupUser(req, res);   
        }
    } catch (err) {
        console.error(err)   
    };
});

// Check if user already exists
app.get('/user/v1/exists', (req, res) => {

    try {
        const { email } = req.body;
        // input validation
        if (!(email)) {
            res.status(ERRC).send({result: 'error', message: 'All inputs are required'});
        } else if (!applib.checkEmail(email)) {
            res.status(ERRC).json({result: 'error', message: 'Email address is invalid'});
        } else {
            // Check user
            db.checkUser(req, res);   
        };
    } catch (err) {
        console.error(err)   
    };
});

// Page not found
app.get('/*', (req, res, next) => {
    res.statusCode = 404;
    res.end('404 - Page not found');
    next();
});




/* =========== PROTECTED ROUTES =========== */

// Set protected routes
const verifyAccess = express.Router(); 
verifyAccess.use((req, res, next) => {
    try {
        const { token } = req.cookies; //get token cookie
        // check for a valid token
        if (token === '' || token === undefined) {
            res.status(ERRC).json({result: 'error', message: 'A token is needed'});
        } else {
            jwt.verify(token, TOKKEY, (error, decoded) => {      
                if (error) {
                    return res.status(ERRC).json({result: 'error', message: error.toString()});  
                } else {
                    req.decoded = decoded;    
                    next();
                }
            });
        }
    } catch (err) {
        console.error(err)   
    };
 });

//logout
app.get('/user/v1/logout', verifyAccess, (req, res) => {
    try {
      
      // Clear token cookie
      res.clearCookie('token');
      res.status(OKC).json({ result:'succeed', message: 'User has been logout'});

    } catch (err) {
        console.error(err)   
    };     
});

// get users
app.get('/user/v1', verifyAccess, (req, res) => {
    try {
        db.getUser(req, res);
    } catch (err) {
        console.error(err)   
    };
});

module.exports = {app};


