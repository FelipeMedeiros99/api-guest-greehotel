import puppeteer, { TimeoutError } from "puppeteer";


export async function pageConfig() {
    const browser = await puppeteer.launch({
        headless: false
    })
    const page = await browser.newPage();

    return page
}

export async function openPageAndLogin(page, loginData) {
    const loginPage = 'https://gree.hflow.com.br/authentication/login'
    const elements = {
        inputEmail: "input[formcontrolname='username']",
        inputPassword: "input[formcontrolname='password']",
        buttonLogin: ".btn"
    }

    try{

        await page.goto(loginPage)
        await page.waitForSelector(elements.inputEmail, {timeout: 1000})
        await page.type(elements.inputEmail, `${loginData.email}`);
        await page.type(elements.inputPassword, `${loginData.password}`)
        await page.click(elements.buttonLogin)
    }catch(e){
        throw {message: "Erro ao fazer login", status: 404, error: e}
    }

}

export async function goToReservePage(page) {
    try{
        const elements = {
            navBar: ".navbar-container .sannjdkajsn",
            reserveLink: "https://gree.hflow.com.br/GREE/pms/reservations/new"
        };
        await page.waitForSelector(elements.navBar, {timeout: 7000})
        await page.goto(elements.reserveLink)
    }catch(e){
        if(e instanceof TimeoutError){
            const message = `Erro ao ir para tela de reservas. Verifique se não há mensagens de alerta do google ou se seu email e senha estão corretos e tente novamente.`
            throw {message, status: 413, error: e}
        }
    }
}

export async function clickAtNewGuest(page) {
    try{
        const elements = {
            addNewGuestButton: ".card.card-size.card-backgroud"
        }
        await page.waitForSelector(elements.addNewGuestButton, {timeout: 5000})
        await page.click(elements.addNewGuestButton)
    }catch(e){
        throw {message: `Erro ao clicar em novo usuário, tente novamente.`, error: e}
    }
}

export async function validIfUserExists(page, userData) {
    try{
        const elements = {
            browserGuestInput: ".modal-body .form-control.ng-untouched.ng-pristine.ng-valid",
            localizedGuests: ".table-responsive .cursor-pointer.ng-star-inserted"
        }

        await page.waitForSelector(elements.browserGuestInput, {visible: true})
        await page.type(elements.browserGuestInput, userData.cpf)
        
        await page.waitForSelector(elements.localizedGuests, {timeout: 1000, visible: true})
        const find = await page.$(elements.localizedGuests)
        return !!find
    }catch(e){
        if(e instanceof TimeoutError){
            return false
        }
        throw {message: "Erro ao tentar buscar usuário", error: e}
    }
}


export async function openRegisterGuest(page, userData) {
    try {
        const userExists = await validIfUserExists(page, userData)

        if (userExists) {
            const cells = await page.$$('td');

            for (let cell of cells) {
                const text = await cell.evaluate(el => el.innerText);
                
                if (text.includes(userData.cpf)) {
                    await cell.click();
                    break; 
                }
            }
            // await page.click(`td[value="${userData.cpf}"]`)
            // await element.click()
        } else {
            // await page.waitForSelector(".col-12.mt-05.mb-05 .btn.btn-sm.btn-primary")
            await page.click(".col-12.mt-05.mb-05 .btn.btn-sm.btn-primary")
            fillData(page, userData)
        }

        // await page.waitForSelector(".col-12.mt-05.mb-05 .btn.btn-sm.btn-primary")
        // await page.click(".col-12.mt-05.mb-05 .btn.btn-sm.btn-primary")
        // await fillData(page, userData)

    } catch (e) {
        throw {message: `Erro ao clicar em usuário`, error: e}
    }

}

export async function fillData(page, userData) {
    try {
        const nameInput = ".form-group.mt-0.ng-star-inserted .col-md-10 .form-control.ng-untouched.ng-pristine.ng-valid"
        await page.$(nameInput)
        await page.waitForSelector(nameInput)
        await page.type(nameInput, `${userData.name}`)

        await page.type("input[name='whatsApp']", `${userData.phone}`)
        
        await page.type("input[name='fiscalNumber']", `${userData.cpf}`, {delay:50})
        
        await page.type("input[name='postalCode']", `${userData.cep}`)

        await page.click(".feather.feather-search.cursor-pointer")

        await page.click(".modal-content .form-actions.border-0.right .p-element.btn.btn-loading.btn-success.btn-sm.p-button.p-component")
    } catch (e) {
        throw {message: `erro ao preencher dados do usuário`, error: e}
    }
}

export async function main(userData, loginData) {
    try {
        const page = await pageConfig() 
        await openPageAndLogin(page, loginData)
        await goToReservePage(page)
        await clickAtNewGuest(page)
        console.log(await validIfUserExists(page, userData))

        // await openRegisterGuest(page, userData)
        // await validIfUserExists(page, userData)
    } catch (e) {
        console.log(e)
    }
}