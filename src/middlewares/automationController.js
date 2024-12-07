import { clickAtNewGuest, goToReservePage, openPageAndLogin, pageConfig } from "../services/comands.js";

export async function automationMiddleware(req, res, next){
    
    let {userData, loginData} = req.body;

    try{
        const page = await pageConfig() 
        await openPageAndLogin(page, loginData)
        await goToReservePage (page)
        await clickAtNewGuest (page)
        // console.log(await validIfUserExists(page, userData))
    
        // await openRegisterGuest(page, userData)
        // await validIfUserExists(page, userData)
        // await main(userData, loginData)
        res.status(200).send("Automação finalizada")    
    }catch(e){
        next(e)
    }
}