const express = require("express")
const router = express.Router()
const {createNewGame, findgame, makeMove, getData} = require("./GameController")
const {checkString} = require("../security")


router.post("/move/:gameKey", checkString(), findgame(), makeMove)

router.post("/newGame", createNewGame)

router.get("/loadGame/:gameKey", checkString(), findgame(), getData)

module.exports = router