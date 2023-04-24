import express from "express"
import express from "express"
import cors from "cors"
import { MongoClient, ObjectId } from "mongodb"
import dotenv from "dotenv"
import joi from "joi"
import express from "express"



// Server 
const app = express()

// Setup
app.use(express.json())
app.use(cors())
dotenv.config()


// Database Setup
const mongoClient = new MongoClient(process.env.DATABASE_URL)
let db;
mongoClient.connect()
    .then(() => db = mongoClient.db())
    .catch((err) => console.log(err.message))



// Port Server
const PORT = 5000
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`))