import { main } from "./comands.js";
import express, { json } from "express"
import cors from "cors"

const app = express()
app.use(cors())
app.use(json())

app.post("/", async(req, res)=>{
    const {userData, loginData} = req.body;
    try{
        await main(userData, loginData)
        res.status(200).send("Automação finalizada")
    }catch(e){
        res.status(400).send(e)
    }
})

app.listen(5000, ()=>console.log("server runing"))