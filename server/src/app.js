import express from "express";
import env from "dotenv"
import path from "path";
import { checkExistPlayer, logger, errorHandler } from "./middlewares/middleware.js";
import { log } from "console";
env.config({path: "./server/.env"})
const PORT = process.env.PORT


const app = express()

app.use(express.json())
app.use(logger)

app.post("/start-game", (req, res) => res.send("not implemented"))

app.use(checkExistPlayer)

app.post("/start-round", (req, res) => res.send("not implemented"))
app.post("/hit", (req, res) => res.send("not implemented"))
app.post("/stand", (req, res) => res.send("not implemented"))
app.get("/my-round", (req, res) => res.send("not implemented"))

app.use(errorHandler)




app.listen(PORT, () => console.log("listening on port ", PORT))