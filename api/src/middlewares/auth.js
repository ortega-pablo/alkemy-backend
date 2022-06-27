const { User } = require("../db");
const jwt = require("jsonwebtoken");
const authConfig = require ("../config/auth")

const verifyToken = async (req, res, next) => {
  try {

    const headerToken = req.header("Authorization");

    if (!headerToken) {
      return res.status(401).send("Acceso no autorizado.");
    }
    const token = headerToken.replace("Bearer ", "");
    
    jwt.verify(token, authConfig.secret,(error, decoded) => {

        if(error){
            return res.status(500).send("Error decodificando token")
        }else{
            req.user = decoded
            next()
        }
    })

  } catch (error) {
    next(error);
  }
};

module.exports = verifyToken;