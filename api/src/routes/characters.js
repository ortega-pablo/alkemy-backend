const { Router } = require("express");
const router = Router();
const verifyToken = require ("../middlewares/auth")
const {Character, Movie} = require("../db")


router.get("/", verifyToken, async (req,res,next) =>{

    try {
        
        const {name, age, movieId } = req.query

        if(!name && !age && !movieId){
            const allCharacters = await Character.findAll({
                attributes: ["id", "name", "image"],
            })
            res.status(200).send(allCharacters)
        }

        const allCharacters = await Character.findAll({
            attributes: ["id", "name", "image", "age", "weight", "history"],
        })
        if(name){
            console.log("Tengo nombre")
            let charactersByName = allCharacters.filter(c => c.name.toLowerCase().includes(name.toLowerCase()))
            if(charactersByName.length>0){
                let orderedCharacters = await charactersByName.sort((a, b) => {
                    if (a.name.length > b.name.length) {
                      return 1;
                    } else if (a.name.length < b.name.length) {
                      return -1;
                    } else {
                      return 0;
                    }
                  });
                
                res.status(200).send(orderedCharacters)
            } else {
                res.status(400).send("No se encontraron coincidencias")
            }
        }

        if(age){
            console.log("Tengo age")
            let charactersByAge = allCharacters.filter(c => c.age == age)
            
            if(charactersByAge.length>0){
                return res.status(200).send(charactersByAge)
            }else{
                return res.status(400).send("No se encontraron personajes con la edad solicitada")
            }
        }

        if(movieId){
            let charactersByMovie = await Character.findAll({
                where:{
                    include: [
                        {
                          model: Movie,
                          attributes: ["image", "title", "createdDate", "rating"],
                        },
                    ]
                }
            })
            if(charactersByMovie){
                return res.status(200).send(charactersByMovie)
            }else{
                return res.status(400).send("No se encontraron personajes asociados a la película seleccionada")
            }
        }


    } catch (error) {
        next(error)
    }
})

router.post("/", verifyToken, async (req,res,next) =>{

    try {
        
        const {image, name, age, weight, history} = req.body
        const newCharacter = await Character.create({
            image,
            name,
            age,
            weight,
            history,
        })

        res.status(200).send(newCharacter)

    } catch (error) {
        next(error)
    }
})

router.put("/", verifyToken, async (req,res,next) =>{

    try {
        
        const {characterId, image, name, age, weight, history} = req.body

        const findCharacter = await Character.findOne({
            where:{
                id: characterId
            }
        })

        if(findCharacter){
            await Character.update({
                image,
                name,
                age,
                weight,
                history,
            },
            {
                where:{
                    id: characterId
                }
            })
            res.status(200).send("Personaje modificado correctamente")
        }else{
            res.status(400).send("Personaje no encontrado.")
        }

    } catch (error) {
        next(error)
    }
})

router.delete("/", verifyToken, async (req,res,next) =>{

    try {
        
        const {characterId} = req.body
        
        const findCharacter = await Character.findOne({
            where:{
                id: characterId
            }
        })

        if(findCharacter){
            await Character.destroy({
                where:{
                    id: characterId
                }
            })
            res.status(200).send("Personaje eliminado correctamente.")
        } else {
            res.status(400).send("Personaje no encontrado")
        }



        res.status(200).send(newCharacter)

    } catch (error) {
        next(error)
    }
})

router.post("/addMovie", verifyToken, async (req,res,next) =>{

    try {
        
        const {characterId, movieId} = req.body

        const findCharacter = await Character.findOne({
            id: characterId,
        })
        const findMovie = await Movie.findOne({
            id: movieId,
        })

        if(findCharacter){
            if(findMovie){

                findCharacter.addMovie(findMovie)
        
                res.status(200).send("Película asociada con éxito")
            }else{
                return res.status(400).send("Película no encontrada")
            }
        }else{
            return res.status(400).send("Personaje no encontrado")
        }

    } catch (error) {
        next(error)
    }
})

router.put("/removeMovie", verifyToken, async (req,res,next) =>{

    try {
        
        const {characterId, movieId} = req.body

        const findCharacter = await Character.findOne({
            id: characterId,
        })
        const findMovie = await Movie.findOne({
            id: movieId,
        })

        if(findCharacter){
            if(findMovie){

                findCharacter.removeMovie(findMovie)
        
                res.status(200).send("Película eliminada con éxito")
            }else{
                return res.status(400).send("Película no encontrada")
            }
        }else{
            return res.status(400).send("Personaje no encontrado")
        }

    } catch (error) {
        next(error)
    }
})

router.get("/:characterId", verifyToken, async (req,res,next) =>{

    try {
        const {characterId} = req.params
        const characterDetail = await Character.findOne({
            where:{
                id: characterId
            },
            include: [
                {
                  model: Movie,
                  attributes: ["image", "title", "createdDate", "rating"],
                },
            ]
        })

        res.status(200).send(characterDetail)

    } catch (error) {
        next(error)
    }
})

module.exports = router;