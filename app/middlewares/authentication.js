const jwt=require('jsonwebtoken')

const User = require('../models/credential');

const verify = async function(req,res,next)
{
  console.log('In Verify Token') 
  const token = req.headers.authorization.split(' ')[1];
  if (!token) return res.status(401).send('Access Denied !');


  console.log("abc",token);

  try 
  {
      const UserID= await jwt.verify(token, process.env.JWT_TOKEN_KEY);
      console.log("ue",UserID)
      if(!UserID){
          return res.send("tst")

      }
      req.user = UserID;  
      next();
  } 
  catch (error) 
  
  {
    console.log(error)
      res.status(400).send('Invalid token !');
  }
 
}

module.exports = verify
