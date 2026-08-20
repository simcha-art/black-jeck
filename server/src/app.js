import express from "express";
import env from "dotenv"
import cors from "cors"
import { checkExistPlayer, logger, errorHandler } from "./middlewares/middleware.js";
import { createPlayer, getOpenRound, hit, OpenNewRound, stand } from "./controllers/controller.js";
env.config({path: "./server/.env"})
const PORT = process.env.PORT


const app = express()

app.use(cors())
app.use(express.json()) 
app.use(logger)


app.post("/start-game", createPlayer)

app.use(checkExistPlayer)

app.post("/start-round", OpenNewRound)
app.post("/hit", hit)
app.post("/stand", stand)
app.get("/my-round", getOpenRound)

app.use(errorHandler)




app.listen(PORT, () => console.log("listening on port ", PORT))