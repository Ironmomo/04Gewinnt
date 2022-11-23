const {Game} = require("./Game")
const model = new Map()

function createNewGame(req,res) {
    if(model.size > 50) {
        res.redirect("/")
    } else {
        const gameMode = req.body.mode
        const gameKey = randomKey()
        const playerOneKey = randomKey()
        const playerTwoKey = randomKey()
        const newGame = new Game(gameMode,playerOneKey,playerTwoKey)
        model.set(gameKey,newGame)
        res.json({gameKey:gameKey,playerKey:playerOneKey,gameBoard:newGame.gameBoard})
    }
}

function findgame() {
    return (req,res,next) => {
        if(isAuth(req.body.gameKey,req.body.playerKey)) {

            req.body.game = model.get(req.body.gameKey)
            next()
        } else {
            res.redirect("/")
        }
    }
}

function makeMove(req,res) {
    if(Number.isInteger(req.body.cell)) {
        const game = req.body.game
        game.nextMove(req.body.cell)
        res.json({gameBoard: game.gameBoard, hasWinner: game.winner})   
    }
}


//private
function randomKey() {
    let key = ""
    for(let i = 0; i < 32; i++) {
        let newChar = String.fromCharCode(Math.floor(Math.random() * (122-97)) + 97)
        key += newChar
    }
    return key
}

function isAuth(gameKey,playerKey) {
    const game = model.get(gameKey)
    return game && (game.playerOneKey === playerKey || game.playerTwoKey === playerKey)
}

module.exports = {createNewGame, findgame, makeMove}