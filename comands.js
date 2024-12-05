import puppeteer, {  } from "puppeteer";

async function pageConfig(){
    const browser = await puppeteer.launch({
        headless: false,
        args: ["--disable-popup-blocking"]
    })
    const page = await browser.newPage();

    return page 
}

async function openPageAndLogin(page, loginData){
    await page.goto('https://gree.hflow.com.br/authentication/login')

    await page.waitForSelector("input[formcontrolname='username']")
    
    await page.type("input[formcontrolname='username']", `${loginData.email}`);
    await page.type("input[formcontrolname='password']", `${loginData.password}`)
    await page.click(".btn")
}

async function goToReservePage(page) {
    await page.waitForSelector(".navbar-container")
    await page.goto("https://gree.hflow.com.br/GREE/pms/reservations/new")
    
}

async function openRegisterGuest(page ) {
    await page.waitForSelector(".card.card-size.card-backgroud")
    await page.click(".card.card-size.card-backgroud")

    await page.waitForSelector(".col-12.mt-05.mb-05 .btn.btn-sm.btn-primary")
    await page.click(".col-12.mt-05.mb-05 .btn.btn-sm.btn-primary")
}

async function fillData(page, userData) {
    await page.waitForSelector("input[name='names']")
    await page.type("input[name='names']", `${userData.name}`)

    await page.type("input[name='whatsApp']", `${userData.phone}`)

    await page.type("input[name='fiscalNumber']", `${userData.cpf}`)

    await page.type("input[name='postalCode']", `${userData.cep}`)

    await page.click(".feather.feather-search.cursor-pointer")

    await page.click(".modal-content .form-actions.border-0.right .p-element.btn.btn-loading.btn-success.btn-sm.p-button.p-component")
}

export async function main(userData, loginData){
    try{
        const page = await pageConfig()
        await openPageAndLogin(page, loginData)   
        await goToReservePage(page)
        await openRegisterGuest(page)
        await fillData(page, userData)
    }catch(e){
        console.log(e)
    }
}