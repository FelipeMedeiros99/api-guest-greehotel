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
            navBar: ".navbar-container",
            reserveLink: "https://gree.hflow.com.br/GREE/pms/reservations/new"
        };
        await page.waitForSelector(elements.navBar, {timeout: 10000})
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
        
        await page.waitForSelector(elements.localizedGuests, {timeout: 2500, visible: true})
        const find = await page.$(elements.localizedGuests)
        return !!find
    }catch(e){
        if(e instanceof TimeoutError){
            return false
        }
        throw {message: "Erro ao tentar buscar usuário", error: e}
    }
}

export async function selectUserExisted(page, userData) {
    try{
    const elements = {
        cells: "td",
        userCell: `td[value="${userData.cpf}"]`
    }
    const cells = await page.$$(elements.cells);
        for (let cell of cells) {
            const text = await cell.evaluate(el => el.innerText);
            if (text.includes(userData.cpf)) {
                await cell.click();
                break; 
            }
        }
    }catch(e){
        throw {message: "Erro ao selecionar usuário existente", error: e, status: 500}
    }
}

export async function openRegisterGuest(page, userData) {
    try {
        const elements = { 
            buttonAddGuest: ".col-12.mt-05.mb-05 .btn.btn-sm.btn-primary"
        }
        await page.waitForSelector(elements.buttonAddGuest, {visible: true})
        await page.click(elements.buttonAddGuest)
        fillData(page, userData)

    } catch (e) {
        throw {message: `Erro ao clicar em usuário`, error: e}
    }

}

export async function fillData(page, userData) {
    const elements = {
        nameInput: ".form-group.mt-0.ng-star-inserted .col-md-10 .form-control.ng-untouched.ng-pristine.ng-valid",
        whatsappInput: "input[name='whatsApp']",
        cpfInput: "input[name='fiscalNumber']",
        cepInput: "input[name='postalCode']",
        browserAddressButton: ".feather.feather-search.cursor-pointer",
        finishButton: ".modal-content .form-actions.border-0.right .p-element.btn.btn-loading.btn-success.btn-sm.p-button.p-component"
        


    }
    try {
        await page.waitForSelector(elements.nameInput, {visible: true})
        await page.type(elements.nameInput, `${userData.name}`)
        await page.type(elements.whatsappInput, `${userData.phone}`)
        await page.type(elements.cpfInput, `${userData.cpf}`, {delay:50})
        await page.type(elements.cepInput, `${userData.cep}`)
        await page.click(elements.browserAddressButton)
        await page.click(elements.finishButton)
    } catch (e) {
        throw {message: `erro ao preencher dados do usuário`, error: e}
    }
}
