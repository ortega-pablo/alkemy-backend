const { Router } = require('express');
const router = Router();

const authRouter = require('./auth');
const charactersRouter = require("./characters")
const moviesRouter = require("./movies")


router.use("/auth", authRouter);
router.use("/characters", charactersRouter)
router.use("/movies", moviesRouter)

module.exports = router;
