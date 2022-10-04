'use strict';

const ERRC = parseInt(process.env.ERRC);   // Error code
const OKC = parseInt(process.env.OKC);     // OK code
const TOKKEY = process.env.TOKKEY; 
const TOKOPT = { expiresIn: '30m' };
const COKOPT = { expires: 0};

// Set JSON Web Token
const jwt = require('jsonwebtoken');

// Create connection pool
const Pool = require('pg').Pool;
let pgopt = {
  connectionString: process.env.DATABASE_URL
  /* ssl: { rejectUnauthorized: false } */
};
const pool = new Pool(pgopt);

// Test connection pool
(async function() {
  pool.query(
    `SELECT NOW() as started_at, VERSION() as with_version`, 
  (error, results) => 
  {
    if (error) {
      throw error
    }
    console.log('PostgreSQL pool');
    console.log(results.rows[0]);
  });
})();

// User login
const userLogin = (req, res) => {
  
    // Get parameters
    const { email, password } = req.body;

    // Credentials check
    const qs = `SELECT email, fullname FROM users
                WHERE email = '${email}' AND password = crypt('${password}', password)`;

    pool.query(qs, (error, results) => {
        if (error) {
            res.status(ERRC).json({result: 'error', message: error.toString()});
        } else if (results.rowCount < 1) {
            res.status(ERRC).json({result: 'error', message: 'Invalid credentials'});
        } else {
            // Token sign
            const payload = {check: true};
            const token = jwt.sign(payload, TOKKEY, TOKOPT);

            // Send token cookie 
            res.cookie('token', token, COKOPT);

            var msg = { result:'succeed', message: 'Access granted', email:'', fullname:'' };
            msg.email = results.rows[0].email;
            msg.fullname = results.rows[0].fullname;
            res.status(OKC).json(msg);
        };
    });
};

// Get users
const getUser = (req, res) => 
{
  let { email } = req.body;
  let qs;

  // Check email
  if(email === '' || email === undefined){
    qs = 'SELECT email, fullname, created_at, updated_at FROM users';
  } else {
    qs = `SELECT email, fullname, created_at, updated_at FROM users WHERE email='${email}'`;  
  };

  // Get users from db
  pool.query(qs, (error, results) => 
  {
    if (error) {
      res.status(ERRC).json({result: 'error', message: error.toString()});
    } else if (results.rowCount < 1) {
      res.status(ERRC).json({result: 'error', message: 'Email does not exists'});
    } else {
      res.status(OKC).json(results.rows);
    };
  });
};


// Check if user exists
const checkUser = (req, res) => 
{
  
  const { email } = req.body;

  let qs = `SELECT email FROM users WHERE email='${email}'`;

   // Check if user already exits
   pool.query(qs, (error, results) => 
   {
     if (error) {
       res.status(ERRC).json({result: 'error', message: error.toString()});
     } else if (results.rowCount > 0) {
       res.status(ERRC).json({result: 'error', message: 'User already exists'});
     } else {
      res.status(OKC).json({result: 'succeed', message: 'User does not exists'});
     };
   });
};

// Signup user
const signupUser = (req, res) => 
{
  let { email, fullname, password } = req.body;
  
  // Register user in the db
  let qs = `INSERT INTO users(email, fullname, password)
  VALUES ('${email}', '${fullname}', '${password}')`;

  pool.query(qs, (error, results) => 
  {
    if (error) {
      res.status(ERRC).json({error: error.message});
    } else {
      res.status(OKC).json({result:'succeed', message: 'User has been signed up'});  
    }
  });
};

module.exports = {
  userLogin,
  getUser,
  signupUser,
  checkUser
};
