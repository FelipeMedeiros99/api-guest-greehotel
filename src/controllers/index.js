import { main } from "../services/comands.js";

export async function mainController(req, res){
    let {userData, loginData} = req.body;
    try{
        await main(userData, loginData)
        res.status(200).send("Automação finalizada")
    }catch(e){
        console.log(e)
        res.status(500).send(e)
    }
    
}