'use strict'

// Check email
function checkEmail (email)
{
  if (email.length < 5 || email.length > 255) {
    return false;
  } else {
    const re = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
    return re.test(String(email).toLowerCase());
  };
};

// Check password
function checkPassword (password)
{
  // check length
  if (password.length < 8) {
      return false;
  };

  // check for digits
  if (!RegExp('[0-9]').test(password)){
      return false;
  };

  // check for characters
  if (!RegExp('[A-Za-z]').test(password)){
      return false;
  };

  return true;
};

// Check fullname
function checkFullname (fullname)
{
  // Check length
  if (fullname.length < 5) {
    return false
  } else {
    return true;  
  }
};


module.exports = {
  checkEmail,
  checkFullname,
  checkPassword
};

