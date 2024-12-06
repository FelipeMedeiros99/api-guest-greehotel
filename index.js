import { main } from "./comands.js";
import express, { json } from "express"
import cors from "cors"

const app = express()
app.use(cors())
app.use(json())

app.post("/", async(req, res)=>{
    let {userData, loginData} = req.body;
    console.log(userData)
    // userData = {name: userData.name[0] || "", cep: userData.cep[0]|| "", phone: userData.phone[0]|| "", cpf: userData.cpf[0]|| ""}
    console.log(userData) 
    try{
        await main(userData, loginData)
        res.status(200).send("Automação finalizada")
    }catch(e){
        res.status(400).send(e)
    }
})

app.listen(5000, ()=>console.log("server runing"))