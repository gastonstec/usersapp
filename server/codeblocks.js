// ******************
app.post('/jwtauth', (req, res) => {
    try {
        
        if(req.body.user === 'gaston' && req.body.password === 'mypasswd') {
            const payload = {
                check:  true
            };
            const token = jwt.sign(payload, app.get('jwtkey'), {expiresIn: "15m"});
            res.json({
                message: 'User authenticated',
                token: token
            });
        } else {
            res.json({message: 'Incorrect user or password'})
        };
    } catch (err) {
        console.error(err)   
    };
});


// app.post('/login', (req, res) => {

    
//     try {
//       // Get user input
//       const { email, password } = req.body;
  
//       // Validate input
//       if (!(email && password)) {
//         res.status(ERRCODE).send('All input is required');
//       }

//       // Validate if user exist in our database
//       const user = await User.findOne({ email });
  
//       if (user && (await bcrypt.compare(password, user.password))) {
//         // Create token
//         const token = jwt.sign(
//           { user_id: user._id, email },
//           process.env.TOKEN_KEY,
//           {
//             expiresIn: '2h',
//           }
//         );
  
//         // save user token
//         user.token = token;
  
//         // user
//         res.status(OKCODE).json(user);
//       }
//       res.status(ERRCODE).send('Invalid Credentials');
//     } catch (err) {
//       console.log(err);
//     }
//     // Our register logic ends here
//   });



else {
  let res = false;
  if(results.rowCount > 0) {
    console.log(results.rowCount);
    res = true
  };

var appConfig = JSON.parse('{}');


const loadAppConfig = async() => {
  let qs = `SELECT config FROM tbl_app_configs WHERE app_id='${process.env.APPID}' AND version='${process.env.APPVERSION}'`;
  let res = await execQuery(qs);
  console.log('la respuesta');
  console.log(res.rows);
  appConfig = JSON.parse(JSON.stringify(res.rows[0]['config']));
};


pool.connect((err, client, release) => {
  if (err) {
    return console.error('Error acquiring client', err.stack)
  }
  client.query('SELECT VERSION(), NOW()', (err, result) => {
    release()
    if (err) {
      return console.error('Error executing query', err.stack)
    }
    console.log('pgPool connected')
    console.log(result.rows[0])
  })
});

const execQuery = async (qry) => {
  let res;
  try {
    res = await pool.query(qry);
    console.log(res.rows);
    return res;
  } catch(err) {
      console.log(err);
  }
};

function execQuery(qs) {
  const qryPromise = pool
  .query(qs)
  .then(res => res)
  .catch(err => console.error('Error executing query', err.stack));

  Promise.all([qryPromise])
  .then(function(results) {
    res = results);
  })
  .catch(function(error) {
    console.log('one or more requests have failed: ' + error);
  });
  return results;
};

const getAppConfig = () => {
  var result;
  var qs = `SELECT config FROM tbl_app_configs WHERE app_id='${process.env.APPID}' AND version='${process.env.APPVERSION}'`;
  result = execQuery(qs);
  console.log('aqui el resultado');
  console.log(result);
  //return JSON.parse(JSON.stringify(result.rows[0]['config']));
  return '{}'
 };

 const { Pool } = require('pg')
 const pool = new Pool();
 
 (async function() {
   pool.query(
     `SELECT VERSION(), NOW()`, 
   (error, results) => 
   {
     if (error) {
       throw error
     }
     console.log('PostgreSQL pool started:');
     console.log(results.rows[0]);
   })
 })();

// (async function() {
//   try {
//     const client = await pool.connect();
//     const qs = `SELECT NOW() as pool_started_at`;
//     const rs = await client.query(qs);
//     console.log(rs.rows[0]);
//     client.release();
//   } catch (error) {
//     console.error(error);
//   }
// })();



// Get configs
function getAppConfig () {
  pool.query(
    `SELECT config FROM tbl_app_configs 
    WHERE app_id='${process.env.APPID}' 
    AND version='${process.env.APPVERSION}'`, 
  (error, results) => 
  {
    if (error) {
      throw error
    }

    return JSON.parse(JSON.stringify(results.rows[0]['config']));
  });
};


// Load configs
(async function() {
    try {
      let client = await pool.connect();
      let qs = `SELECT config FROM tbl_app_configs 
      WHERE app_id='${process.env.APPID}' AND version='${process.env.APPVERSION}'`;
      let rs = await client.query(qs);
      console.log(`App configuration loaded: ${JSON.stringify(rs.rows[0]['config'])}`);
      appConfig = JSON.stringify(rs.rows[0]['config']);
      client.release();
    } catch (error) {
      console.error(error);
    };
  })();;

  try {
    let client = pool.connect();
    let qs = `SELECT config FROM tbl_app_configs 
    WHERE app_id='${process.env.APPID}' AND version='${process.env.APPVERSION}'`;
    let rs = client.query(qs);
    console.log(`App configuration loaded: ${JSON.stringify(rs.rows[0]['config'])}`);
    appConfig = JSON.stringify(rs.rows[0]['config']);
    client.release();
  } catch (error) {
    console.error(error);
  };


  // Get configs
// const getAppConfig = () => {
 
//   let client = new Client();

//   client.connect(err => {
//     if (err) {
//       throw err
//     }
//   });
//   pool.query(
//     `SELECT config FROM tbl_app_configs 
//     WHERE app_id='${process.env.APPID}' 
//     AND version='${process.env.APPVERSION}'`, 
//   (error, results) => 
//   {
//     if (error) {
//       throw error
//     }
//     config = JSON.parse(JSON.stringify(results.rows[0]['config']));
//   });
//   return config;
// };

async queryResponse(query, values) {
  const client = await this.pool.connect();
  try {
   const res = await client.query({text: query,values: values || [],types: {getTypeParser: (dataType, format) => 
                                                                                {const isTimestamp = timestampDataTypes.indexOf(dataType) > -1;
                                                                                  let parser = types.getTypeParser(dataType, format);
                                                                                  if (isTimestamp) {parser = timestampTypeParser;}return val => parser(val);},
                                                                            },
                                  });
   return res;
  } finally {
   await client.release();
  }
 }




 'use strict'

// Set environment variables
const dotenv = require('dotenv');
dotenv.config();

// Set database
const db = require('./app/db');

// Set json web token
const jwt = require('jsonwebtoken');

// Set express
const express = require('express');
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.set('jwtkey', `${process.env.JWTSECKEY}`);
app.set('jwtexp', `${process.env.JWTEXPTIME}`);

app.listen(process.env.EXPRESS_PORT, ()=> {
    console.log(`Express started at port ${process.env.EXPRESS_PORT}`);
});

// Set protected routes
const protectedRoutes = express.Router(); 
protectedRoutes.use((req, res, next) => {
    try {
        const token = req.headers['access-token'];
        
        if (token) {
        jwt.verify(token, app.get('jwtkey'), (err, decoded) => {      
            if (err) {
            return res.json({ message: 'Invalid token' });    
            } else {
            req.decoded = decoded;    
            next();
            }
        });
        } else {
        res.send({ 
            message: 'A token is needed' 
        });
        }
    } catch (err) {
        console.error(err)   
    };
 });


// // ******************
// app.post('/jwtauth', (req, res) => {
//     try {
        
//         if(req.body.user === 'gaston' && req.body.password === 'mypasswd') {
//             const payload = {
//                 check:  true
//             };
//             const token = jwt.sign(payload, app.get('jwtkey'), {expiresIn: `'${app.get('jwtexp')}'`});
//             res.json({
//                 message: 'User authenticated',
//                 token: token
//             });
//         } else {
//             res.json({message: 'Incorrect user or password'})
//         };
//     } catch (err) {
//         console.error(err)   
//     };
// });

// app.post('/login', async (req, res) => {

    
//     try {
//       // Get user input
//       const { email, password } = req.body;
  
//       // Validate input
//       if (!(email && password)) {
//         res.status(400).send('All input is required');
//       }

//       // Validate if user exist in our database
//       const user = await User.findOne({ email });
  
//       if (user && (await bcrypt.compare(password, user.password))) {
//         // Create token
//         const token = jwt.sign(
//           { user_id: user._id, email },
//           process.env.TOKEN_KEY,
//           {
//             expiresIn: '2h',
//           }
//         );
  
//         // save user token
//         user.token = token;
  
//         // user
//         res.status(200).json(user);
//       }
//       res.status(400).send('Invalid Credentials');
//     } catch (err) {
//       console.log(err);
//     }
//     // Our register logic ends here
//   });


// // Set protected routes
// const protectedRoutes = express.Router(); 
// protectedRoutes.use((req, res, next) => {
//     try {
//         const token = req.headers['access-token'];
        
//         if (token) {
//         jwt.verify(token, app.get('jwtkey'), (err, decoded) => {      
//             if (err) {
//             return res.json({ message: 'Invalid token' });    
//             } else {
//             req.decoded = decoded;    
//             next();
//             }
//         });
//         } else {
//         res.send({ 
//             message: 'A token is needed' 
//         });
//         }
//     } catch (err) {
//         console.error(err)   
//     };
//  });



// get users
app.get('/users', protectedRoutes, (req, res) => {
    try {
        db.getAllUsers(req, res);
    } catch (err) {
        console.error(err)   
    };
});


// app.post('/signup', protectedRoutes, (req, res) => {
//     try {
//         if (!db.checkEmail(req.body.user_email)) {
//             res.status(400).json({error: 'User email address is invalid'});
//         } else if (!db.checkPassword(req.body.user_password)) {
//             res.status(400).json({error: 'User password is invalid'})
//         } else if (!db.checkFullname(req.body.user_fullname)) {
//             res.status(400).json({error: 'User full name is invalid'})
//         } else {
//             db.signupUser(req, res);   
//         }
//     } catch (err) {
//         console.error(err)   
//     };
// });