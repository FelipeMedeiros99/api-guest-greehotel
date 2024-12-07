import express, { json } from "express"
import cors from "cors"
import { mainController } from "./controllers/index.js";
import handleError from "./middlewares/handleError.js";
import { automationMiddleware } from "./middlewares/automationController.js";

const app = express()
app.use(cors())
app.use(json())

app.post("/",automationMiddleware, mainController)
app.use(handleError)

app.listen(5000, ()=>console.log("server runing"))