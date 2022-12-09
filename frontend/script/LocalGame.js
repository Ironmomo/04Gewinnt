export class Game {
    constructor(gameMode) {
        this.numRows = 6
        this.numCells = 7
        this.maxDepth = 5
        this.gameMode = gameMode
        this.activePlayer = 0
        this.isRunning = true
        this.winner = undefined
        this.gameBoard = Array(this.numRows).fill("").map(() => Array(this.numCells).fill(""))
        this.bewertungsMatrix = [[0.03,0.04,0.05,0.07,0.05,0.04,0.03],
                                [0.04,0.06,0.07,0.1,0.07,0.06,0.04],
                                [0.05,0.08,0.11,0.13,0.11,0.08,0.05],
                                [0.05,0.08,0.11,0.13,0.11,0.08,0.05],
                                [0.04,0.06,0.07,0.1,0.07,0.06,0.04],
                                [0.03,0.04,0.05,0.07,0.05,0.04,0.03]]
    }

    getGameBoard() {
        return gameBoard
    }

    resetGame(mode) {
        if(mode > 0 && mode <=2) {
            this.gameMode = mode
        }
        this.gameBoard = Array(this.numRows).fill("").map(() => Array(this.numCells).fill(""))
        this.activePlayer = 0
        this.isRunning = true
        this.winner = undefined
    }

    clearBoard() {
        this.gameBoard.forEach((row,y) => {
            row.forEach((cell,x) => {
                if(cell !== "") {
                    this.gameBoard[y][x] = cell.substring(0,1)
                }
            }) 
        })
    }

    checkWinner() {
        for(let y = 0; y < this.numRows; y++) {
            for(let x = 0; x < this.numCells; x++) {
                if(this.gameBoard[y][x] !== "") {
                    const color = this.gameBoard[y][x].substring(0,1)
                    const hor =  this.checkHorizontal(x, y, color)
                    const ver = this.checkVertical(x, y, color)
                    const diaOne = this.checkDiagonal(x, y, color, true)
                    const diaTwo = this.checkDiagonal(x, y, color, false)
                    if(hor === 4 || ver === 4 || diaOne === 4 || diaTwo === 4) {
                        return true
                    }
                }
            }
        }
    }


    checkHorizontal(x,y,color) {
        if(0 <= x && x < this.numCells && this.gameBoard[y][x].substring(0,1) === color) {
            return 1 + this.checkHorizontal(x + 1, y, color)
        }
        return 0
    }

    checkVertical(x,y,color) {
        if(0 <= y && y < this.numRows && this.gameBoard[y][x].substring(0,1) === color) {
            return 1 + this.checkVertical(x, y + 1, color)
        }
        return 0
    }

    checkDiagonal(x,y,color,min) {
        if(0 <= x && x < this.numCells && 0 <= y && y < this.numRows && this.gameBoard[y][x].substring(0,1) === color) {
            if(min) {
                return 1 + this.checkDiagonal(x - 1, y + 1, color, true)
            } else {
                return 1 + this.checkDiagonal(x + 1, y + 1, color, false)
            }
        }
        return 0
    }


    //make reset move
    makeMove(cell, color) {
        if(this.isRunning) {
            let row = -1
            for(let i = this.numRows - 1; i >= 0; i--) {
                if(this.gameBoard[i][cell] === "") {
                    row = i
                    break
                }
            }
            if(row !== -1) {
                this.gameBoard[row][cell] = `${color.substring(0,1)}n`
            }
        }
    }

    resetMove(cell) {
        for(let i = 0; i < this.numRows; i++) {
            if(this.gameBoard[i][cell] !== "") {
                this.gameBoard[i][cell] = ""
                break
            }
        }
    }

    aiMakeMove() {
        const bestMove = this.findBestMove()
        this.makeMove(bestMove, "red")
        
    }

    nextMove(cell) {
        this.clearBoard()
        if(cell >= 0 && cell < this.numCells && this.isRunning) {
            if(this.gameMode === 1) {
                this.makeMove(cell,"blue")
                if(this.checkWinner()) {
                    this.isRunning = false
                    this.winner = "blue"  
                }
                if(this.isRunning) {
                    this.aiMakeMove()
                    if(this.checkWinner()) {
                        this.isRunning = false
                        this.winner = "red"  
                    }
                }
            } else {
                const nextPlayer = this.activePlayer === 0 ? "blue" : "red"
                this.makeMove(cell,nextPlayer)
                if(this.checkWinner()) {
                    this.isRunning = false
                    this.winner = nextPlayer  
                }
                this.activePlayer = this.activePlayer === 0 ? 1 : 0
            }
        }
    }


    //minimax

    findBestMove() {
        let currentBestMove = undefined
        let maxWert = -Infinity
        for(let i = 0; i < this.numCells; i++) {
            if(this.gameBoard[0][i] === "") {
                this.makeMove(i,"red")
                let score = this.minimax(this.maxDepth,-Infinity,Infinity,false)
                this.resetMove(i)
                if(score >= maxWert) {
                    maxWert = score
                    currentBestMove = i
                }
            }
        }
        return currentBestMove
    }

    bewertung() {
        let bew = 0
        this.gameBoard.forEach((row,y) => {
            row.forEach((col,x) => {
                if(col !== "") {
                    col.substring(0,1) === "r" || col ? bew += this.bewertungsMatrix[y][x] : bew -= this.bewertungsMatrix[y][x]
                }
            })
        })
        return bew
    }

    minimax(depth,alpha,beta,isMax) {
        if(this.checkWinner()) {
            if(isMax) {
                return -Infinity/(this.maxDepth + 1 - depth)
            } else {
                return Infinity/(this.maxDepth + 1 - depth)
            }
        }
        if(depth === 0 ) {
            return this.bewertung()
        }
        if(isMax) {
            for(let i = 0; i < this.numCells; i++) {
                if(this.gameBoard[0][i] === "") {
                    this.makeMove(i,"red")
                    alpha = Math.max(alpha, this.minimax(depth - 1, alpha, beta, false))
                    this.resetMove(i)
                    if(alpha >= beta) {
                        return alpha
                    }
                }
            }
            return alpha
        }

        if(!isMax) {
            for(let i = 0; i < this.numCells; i++) {
                if(this.gameBoard[0][i] === "") {
                    this.makeMove(i,"blue")
                    beta = Math.min(beta, this.minimax(depth - 1, alpha, beta, true))
                    this.resetMove(i)
                    if(alpha >= beta) {
                        return beta
                    }
                }
            }
            return beta
        }
    }
}

