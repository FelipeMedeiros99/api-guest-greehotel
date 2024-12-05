import puppeteer, { } from "puppeteer";
import { timeout } from "puppeteer";

async function pageConfig() {
    const browser = await puppeteer.launch({
        headless: false,
        args: ["--disable-popup-blocking"]
    })
    const page = await browser.newPage();

    return page
}

async function openPageAndLogin(page, loginData) {
    try{

        await page.goto('https://gree.hflow.com.br/authentication/login')
        
        await page.waitForSelector("input[formcontrolname='username']")
        
        await page.type("input[formcontrolname='username']", `${loginData.email}`);
        await page.type("input[formcontrolname='password']", `${loginData.password}`)
        await page.click(".btn")
    }catch(e){
        throw `erro ao efetuar login ${e}`
    }
}

async function goToReservePage(page) {
    try{

        await page.waitForSelector(".navbar-container")
        await page.goto("https://gree.hflow.com.br/GREE/pms/reservations/new")
    }catch(e){
        throw "erro ao ir para tela de reservas"
    }

}


async function clickAtNewGuest(page) {

    await page.waitForSelector(".card.card-size.card-backgroud")
    await page.click(".card.card-size.card-backgroud")
}

async function validIfUserExists(page, userData) {
    try{

        // await page.waitForSelector(".swal2-popup.swal2-modal.swal2-icon-error.swal2-show")
        // const errorBox = await page.$$(".swal2-popup.swal2-modal.swal2-icon-error.swal2-show")

        await page.waitForSelector(".form-control.ng-untouched.ng-pristine.ng-valid")
        await page.type("input[name='name'", userData.cpf)
        await page.waitForSelector(`.table-responsive .cursor-pointer.ng-star-inserted`, {timeout: 1000})
        const find = await page.$(".table-responsive .cursor-pointer.ng-star-inserted")
        return find
    }catch(e){
        // console.log(e)
        return false
    }
}


async function openRegisterGuest(page, userData) {
    try {
        await clickAtNewGuest(page)
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
        console.log("erro: ", e)
        throw 'Erro ao clicar em usuário'
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
        throw "erro ao preencher dados do usuário"
    }
}

export async function main(userData, loginData) {
    try {
        const page = await pageConfig()
        await openPageAndLogin(page, loginData)
        await goToReservePage(page)
        await openRegisterGuest(page, userData)
        await validIfUserExists(page, userData)
    } catch (e) {
        console.log(e)
    }
}