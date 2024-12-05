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
        res.send(200)
    }catch(e){
        res.send(e).status(400)
    }
})

app.listen(5000, ()=>console.log("server runing"))