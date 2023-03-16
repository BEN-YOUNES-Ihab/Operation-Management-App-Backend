const jwt = require('jsonwebtoken')


const verifyToken = (req, res, next) => {

  if(!req.headers.authorization){
      return res.status(401).send('Unauthorized request');
  }
  let token = req.headers.authorization.split(' ')[1];
  if(token === 'null'){
    return res.status(401).send('Unauthorized request');
  }
  
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decodedToken) => {
    if(err){
      return res.status(401).send('Unauthorized request');
    }

    next()
  })
  
}


module.exports = verifyToken;