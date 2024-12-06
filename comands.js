import puppeteer from "puppeteer";

async function pageConfig() {
    const browser = await puppeteer.launch({
        headless: false
    })
    const page = await browser.newPage();

    return page
}

async function openPageAndLogin(page, loginData) {
    try{
        const loginPage = 'https://gree.hflow.com.br/authentication/login'
        const elements = {
            inputEmail: "input[formcontrolname='username']",
            inputPassword: "input[formcontrolname='password']",
            buttonLogin: ".btn"
        }

        await page.goto(loginPage)
        await page.waitForSelector(elements.inputEmail)
        await page.type(elements.inputEmail, `${loginData.email}`);
        await page.type(elements.inputPassword, `${loginData.password}`)
        await page.click(elements.buttonLogin)

    }catch(e){
        throw {message: `erro ao efetuar login`, error: e}
    }
}

async function goToReservePage(page) {
    try{
        const elements = {
            navBar: ".navbar-container",
            reserveLink: "https://gree.hflow.com.br/GREE/pms/reservations/new"
        };
  
        await page.waitForSelector(elements.navBar)
        await page.goto(elements.reserveLink)
  
    }catch(e){
        throw {message: `erro ao ir para tela de reservas`, error: e} 
    }

}

async function clickAtNewGuest(page) {
    try{
        const elements = {
            addNewGuestButton: ".card.card-size.card-backgroud"
        }
        await page.waitForSelector(elements.addNewGuestButton)
        await page.click(elements.addNewGuestButton)
    }catch(e){
        throw {message: `Erro ao clicar em novo usuário`, error: e}
    }
}

async function validIfUserExists(page, userData) {
    console.log(userData)
    try{
        const elements = {
            browserGuestTag: ".modal-body .form-control.ng-untouched.ng-pristine.ng-valid",

            // await page.type("input[name='name']", userData.cpf)
        }

        // TODO
        await page.waitForSelector(elements.browserGuestTag, {visible: true})
        await page.type(elements.browserGuestTag, userData.cpf)
        // console.log(await page.$$(elements.browserGuestInput))
        // await page.waitForSelector(`.table-responsive .cursor-pointer.ng-star-inserted`, {timeout: 1000})
        // const find = await page.$(".table-responsive .cursor-pointer.ng-star-inserted")
        // return find
    }catch(e){
        throw {message: "Erro ao tentar buscar usuário", error: e}
    }
}


async function openRegisterGuest(page, userData) {
    try {
        const userExists = await validIfUserExists(page, userData)

        if (userExists) {
            const cells = await page.$$('td');

            for (let cell of cells) {
                const text = await cell.evaluate(el => el.innerText);
                console.log(text)

                console.log(text.includes(userData.cpf))
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
            console.log("clicked")
            fillData(page, userData)
        }

        // await page.waitForSelector(".col-12.mt-05.mb-05 .btn.btn-sm.btn-primary")
        // await page.click(".col-12.mt-05.mb-05 .btn.btn-sm.btn-primary")
        // await fillData(page, userData)

    } catch (e) {
        throw {message: `Erro ao clicar em usuário`, error: e}
    }

}

async function fillData(page, userData) {
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
        await validIfUserExists(page, userData)

        // await openRegisterGuest(page, userData)
        // await validIfUserExists(page, userData)
    } catch (e) {
        console.log(e)
    }
}