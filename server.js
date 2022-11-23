const express = require("express")
const app = express()
const gameAreaRouter = require("./backend/gameArea")

app.use(express.json())
app.use(express.static(__dirname+"/frontend"));

//Routen
app.use("/gameArea",gameAreaRouter)

app.get("/",(req,res) => {
    res.sendFile(__dirname+"/frontend/index.html")
})

const port = process.env.PORT || 8000;
app.listen(port,()=>console.log(port));