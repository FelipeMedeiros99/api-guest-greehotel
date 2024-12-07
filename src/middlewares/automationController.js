import { clickAtNewGuest, goToReservePage, openPageAndLogin, openRegisterGuest, pageConfig, selectUserExisted, validIfUserExists } from "../services/comands.js";

export async function automationMiddleware(req, res, next){
    
    let {userData, loginData} = req.body;

    try{
        const page = await pageConfig() 
        await openPageAndLogin(page, loginData)
        await goToReservePage (page)
        await clickAtNewGuest (page)
        if(await validIfUserExists(page, userData)){
            return await selectUserExisted(page, userData)
        }
        await openRegisterGuest(page, userData)
        // await validIfUserExists(page, userData)
        // await main(userData, loginData)
        res.status(200).send("Automação finalizada")    
    }catch(e){
        next(e)
    }
}