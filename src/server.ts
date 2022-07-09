import express from "express"
import dotenv from "dotenv"
import path from "path"
import cors from "cors"
import { mongoConnect } from './database/mongo'

import router from "./routes/routes"

dotenv.config()
mongoConnect();
const server = express()

server.use(express.static(path.join(__dirname, "../public")))
server.use(cors())
server.use(express.json())
server.use(express.urlencoded({extended: true}))
server.use(router)

server.listen(process.env.PORT || 5000)