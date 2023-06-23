const { serialize } = require('cookie');


// Create TOKEN AND SAVING IN COOKIE


const sendToken = (user, statusCode, res) => {
  const token = user.getJWTToken();

  //options for cookie

  const cookieOptions = {
      path: '/',
    expires: new Date(
      Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),

    httpOnly: true,
  };

   // Serialize the cookie
   const cookieValue = serialize('token', token, cookieOptions);

     // Set the cookie header in the response
  res.setHeader('Set-Cookie', cookieValue);

  res.status(statusCode).json({
    success: true,
    user,
    token,
  });
};

module.exports = sendToken;
