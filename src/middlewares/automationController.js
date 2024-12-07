import { clickAtNewGuest, goToReservePage, openPageAndLogin, openRegisterGuest, pageConfig, selectUserExisted, sleep, validIfUserExists } from "../services/comands.js";


export async function automationMiddleware(req, res, next){
    
    let {userData, loginData} = req.body;

    try{
        const page = await pageConfig() 
        await openPageAndLogin(page, loginData)
        await goToReservePage (page)

        for(let i = 0; i<userData.name.length ; i++){
            let data = {
                name: userData.name[i] || "",
                cpf: userData.cpf[i] || "",
                cep: userData.cep[i] || userData.cep[0] || "",
                phone: userData.phone[i] || userData.phone[0] || ""
            }
            
            while (true){
                await clickAtNewGuest (page)
                if(await validIfUserExists(page, data)){
                    if(await selectUserExisted(page, data)){
                        break
                    }
                }else{
                    if(await openRegisterGuest(page, data)){
                        break
                    }
                }
            }
        }

        res.status(200).send("Automação finalizada")    
    }catch(e){
        next(e)
    }
}