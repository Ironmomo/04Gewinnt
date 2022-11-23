const board = document.querySelector(".board")
const btnOne = document.getElementById("btnOne")
const btnTwo = document.getElementById("btnTwo")
const msgBox = document.getElementById("messageBox")
const btnNext = document.getElementById("btnNext")
import {Coin} from "./Coin.js"

const Configs = {
    fieldWidth: 0,
    numRows: 6,
    numCells: 7,
    hasWinner: undefined,
    gameMode: 1,
    gameKey: undefined,
    playerKey: undefined
}

//Variables
let gameBoard = Array(Configs.numRows).fill("").map(() => Array(Configs.numCells).fill(""))
let allCoins = []

//send/recieve
function sendMove(y) {
    const data = {cell: y, playerKey: Configs.playerKey, gameKey:Configs.gameKey}
    let baseUrl = "/gameArea/move/"
    baseUrl = baseUrl.concat(`${Configs.gameKey}`)
    fetch(baseUrl, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(response => {
        gameBoard = response.gameBoard
        Configs.hasWinner = response.hasWinner
        parseBoard()
        showBoard()
        allCoins.forEach(coin =>  {
            if(coin.isNew) {
                if(coin.color === "red" && Configs.gameMode === 1) {
                    setTimeout(() => animation(coin),200)
                } else {
                    animation(coin)
                }
            }

        })
        if(Configs.hasWinner) {
            showWinner()
        }
    })
    .catch(e => console.error(e))  
}

function startNewGame(mode) {
    Configs.hasWinner = undefined
    msgBox.className = ""
    const data = {mode: mode}
    fetch("/gameArea/newGame", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(response => {
        gameBoard = response.gameBoard
        Configs.gameKey = response.gameKey
        Configs.playerKey = response.playerKey
        parseBoard()
        showBoard()
    })
    .catch(e => console.error(e))
}

//Functions

function parseBoard() {
    gameBoard.forEach((row,y) => {
        row.forEach((cell, x) => {
            let coin = ""
            if(cell === "r") {
                coin = new Coin("red",false)
            } else if(cell === "b") {
                coin = new Coin("blue",false)
            }
            else if(cell === "rn") {
                coin = new Coin("red",true)
            } else if(cell === "bn") {
                coin = new Coin("blue",true)
            }
            if(coin instanceof Coin) {
                allCoins.push(coin)
            }
            gameBoard[y][x] = coin
        })
    })
}

function showBoard () {
    const elements = []
    gameBoard.forEach((row,yIdx) => {
        row.forEach((field,xIdx) => {
            if(field === "") {
                const div = elt("div","field")
                elements.push(div)
            }else if(field instanceof Coin) {
                let idx = yIdx*Configs.numCells + xIdx
                const fDiv = board.childNodes[idx]
                field.setPositionRelativToParent(fDiv)
                const cDiv = elt("div",`piece ${field.color}`)
                cDiv.style = `top: ${field.currentPosition.y}px; left: ${field.currentPosition.x}px`
                fDiv.replaceChildren(cDiv)
                elements.push(fDiv)
            }
        })
    })
    board.replaceChildren(...elements)
}

const elt = (type, className,...children) => {
    const el = document.createElement(type)
    el.className = className
    for(let child of children) {
        el.appendChild(child)
    }

    return el
}

function animation(cell) {
    cell.updateCurrentPosition()
    cell.currentPosition.y === cell.position.y ? undefined : requestAnimationFrame(() => animation(cell))
    showBoard()
}

//eventlisteners
btnOne.addEventListener("click",() => {
    Configs.gameMode = 1
    startNewGame(1)
})

btnTwo.addEventListener("click",() => {
    Configs.gameMode = 2
    startNewGame(2)
})

btnNext.addEventListener("click",() => {
    startNewGame(Configs.gameMode)
})

board.addEventListener("click",(event) => {
    const cell = Math.floor((event.clientX - board.offsetLeft)/Configs.fieldWidth)
    sendMove(cell)
})

function showWinner() {
    msgBox.childNodes[1].innerHTML = `${Configs.hasWinner} WON!!`
    msgBox.className = "show"
}

onload = () => {
    startNewGame(Configs.gameMode)
    showBoard()
    Configs.fieldWidth = board.childNodes[0].offsetWidth
}

onresize = () => {
    showBoard()
    Configs.fieldWidth = board.childNodes[0].offsetWidth
}




/**
 * Artefacts
 * 
 * const randomSetField = () => {
    let color = "red"
    if(Math.round(Math.random()) === 1) {
        color = "blue"
    }
    const field = Math.round(Math.random() * 41)
    let row = field % Configs.numRows
    let cell = field % Configs.numCells
    gameBoard[row][cell] = new Coin(color)
    showBoard()
}
 */
