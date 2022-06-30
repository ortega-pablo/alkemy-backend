const { Router } = require("express");
const router = Router();
const verifyToken = require ("../middlewares/auth")
const {Character, Movie, Genre} = require("../db")

router.get("/", verifyToken, async (req,res,next) =>{

    try {
        
        const {name, idGenero, order } = req.query

        if(!name && !idGenero && !order){
            const allMovies = await Movie.findAll({
                attributes: ["image", "title", "createdDate"],
            })
            res.status(200).send(allMovies)
        }

        const allMovies = await Movie.findAll({
            attributes: ["id", "image", "title", "createdDate", "rating"],
        })
        if(name){
            let moviesByName = allMovies.filter(m => m.title.toLowerCase().includes(title.toLowerCase()))
            if(moviesByName.length>0){
                let orderedMovies = await moviesByName.sort((a, b) => {
                    if (a.title.length > b.title.length) {
                      return 1;
                    } else if (a.title.length < b.title.length) {
                      return -1;
                    } else {
                      return 0;
                    }
                  });
                
                res.status(200).send(orderedMovies)
            } else {
                res.status(400).send("No se encontraron coincidencias")
            }
        }

        if(idGenero){
            let moviesByGenre = await Movie.findAll({
                where:{
                    include: [
                        {
                          model: Genre,
                          attributes: ["image", "name"],
                        },
                    ]
                }
            })
            if(moviesByGenre){
                return res.status(200).send(moviesByGenre)
            }else{
                return res.status(400).send("No se encontraron Películas o series asociadas al género seleccionado")
            }
        }

        if(order){
            if(order === "ASC"){
                let orderedMovies = await allMovies.sort((a, b) => {
                    if (a > b) {
                      return 1;
                    } else if (a < b) {
                      return -1;
                    } else {
                      return 0;
                    }
                  });
                
                res.status(200).send(orderedMovies)
            } else if(order === "DESC"){
                let orderedMovies = await allMovies.sort((a, b) => {
                    if (a > b) {
                      return -1;
                    } else if (a < b) {
                      return 1;
                    } else {
                      return 0;
                    }
                  });
                
                res.status(200).send(orderedMovies)
            }else {
                res.status(400).send("Error al ordenar las películas")
            }

        }


    } catch (error) {
        next(error)
    }
})

router.get("/:movieId", verifyToken, async (req,res,next) =>{

    try {
        const {movieId} = req.params
        const movieDetail = await Movie.findOne({
            where:{
                id: movieId
            },
            include: [
                {
                  model: Character,
                  attributes: ["image", "name", "age", "weight", "history"],
                },
                {
                    model: Genre,
                    attributes: ["name", "image"],
                  },
            ]
        })

        res.status(200).send(movieDetail)

    } catch (error) {
        next(error)
    }
})

router.post("/", verifyToken, async (req,res,next) =>{

    try {
        
        const {image, title, createdDate, rating} = req.body
        const newMovie = await Movie.create({
            image,
            title,
            createdDate,
            rating,
        })

        res.status(200).send(newMovie)

    } catch (error) {
        next(error)
    }
})

router.put("/", verifyToken, async (req,res,next) =>{

    try {
        
        const {movieId, image, title, createdDate, rating} = req.body

        const findMovie = await Movie.findOne({
            where:{
                id: movieId
            }
        })

        if(findMovie){
            await Movie.update({
            image,
            title,
            createdDate,
            rating,
            },
            {
                where:{
                    id: movieId
                }
            })
            res.status(200).send("Película o serie modificada correctamente")
        }else{
            res.status(400).send("Película o serie no encontrada.")
        }

    } catch (error) {
        next(error)
    }
})


router.delete("/", verifyToken, async (req,res,next) =>{

    try {
        
        const {movieId} = req.body
        
        const findMovie = await Movie.findOne({
            where:{
                id: movieId
            }
        })

        if(findMovie){
            await Movie.destroy({
                where:{
                    id: movieId
                }
            })
            res.status(200).send("Película o serie eliminada correctamente.")
        } else {
            res.status(400).send("Película o serie no encontrada")
        }

    } catch (error) {
        next(error)
    }
})



module.exports = router;