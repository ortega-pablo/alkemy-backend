const { Router } = require("express");
const router = Router();
const {User} = require("../db")
const bcrypt = require('bcrypt');
const jtw = require("jsonwebtoken")
const authConfig = require("../config/auth")


router.post("/login", async (req, res, next) => {
  try {
    const {email, password} = req.body

    user = await User.findOne({
        where: {
            email: email
        }
    })

    if(!user){
        return res.status(404).send("El correo ingresado no pertenece a un usuario")
    } else{
        if(bcrypt.compareSync(password, user.password)){

            const userToken = {
                id: user.id,
                userName: user.userName
            }

            const token = jtw.sign({user: userToken}, authConfig.secret,{
                expiresIn: authConfig.expires
            })
            return res.status(200).send(token)
        } else {
            return res.status(401).send("Contraseña incorrecta")
        }
    }
  } catch (error) {
    next(error);
  }
});


router.post("/register", async (req, res, next) => {
    try {
        const {userName, firstName, lastName, email, password} = req.body
        const hashPassword = bcrypt.hashSync(password, Number.parseInt(authConfig.rounds));
        
        const findUser = await User.findOne({
            where: {
                email: email
            }
        })

        if(findUser){
            return res.status(400).send("El email ingresado ya existe.")
        }else{
            
            newUser = await User.create({
                userName,
                firstName,
                lastName,
                email,
                password: hashPassword,
            })

            const userToken = {
                id: newUser.id,
                userName: newUser.userName
            }

            const token = jtw.sign({user: userToken}, authConfig.secret,{
                expiresIn: authConfig.expires
            })
            res.status(200).send(token)
        }

    } catch (error) {
      next(error);
    }
  });

module.exports = router;