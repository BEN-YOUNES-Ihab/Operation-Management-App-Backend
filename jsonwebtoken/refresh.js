const jwt = require('jsonwebtoken')


const refresh = async (req, res) => {

  try{
    const refreshToken = req.cookies['refreshToken'];
    const payload = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET)
    if(!payload){
      return res.status(401).send('Unauthorized request');
    }
    const accessToken = jwt.sign({ id: payload.id }, process.env.ACCESS_TOKEN_SECRET,{ expiresIn: "1800s" });
    res.cookies('accessToken', accessToken);
    res.send('Success');
  }catch(err){
      return res.status(401).send('Unauthorized request');
  }
  
}

module.exports = refresh;