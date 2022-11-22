const express = require("express")
const app = express()

app.use(express.static(__dirname+"/frontend"));

app.get("/",(req,res) => {
    res.sendFile(__dirname+"/frontend/index.html")
})

const port = process.env.PORT || 8000;
app.listen(port,()=>console.log(port));