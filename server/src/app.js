import express from "express";
import env from "dotenv"
import path from "path";

env.config({path: "./server/.env"})


const PORT = process.env.PORT

const app = express()

app.listen(PORT, () => console.log("listening on port ", PORT))