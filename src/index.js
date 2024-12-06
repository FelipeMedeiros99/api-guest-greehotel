import express, { json } from "express"
import cors from "cors"
import { mainController } from "./controllers/index.js";
import handleError from "./middlewares/handleError.js";

const app = express()
app.use(cors())
app.use(json())
app.use(handleError)

app.post("/", mainController)

app.listen(5000, ()=>console.log("server runing"))