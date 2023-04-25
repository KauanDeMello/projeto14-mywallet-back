import express from "express"
import cors from "cors"
import { MongoClient, ObjectId } from "mongodb"
import dotenv from "dotenv"
import joi from "joi"



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



// JOI SCHEMA
const userSchema = joi.object({
    name: joi.string().required(),
    email: joi.string().email().required(),
    password: joi.string().min(3).required(),
    confirmPassword: joi.ref("password")
  })



// validate User Schema

// Endpoints
app.post("/cadastro", async (req, res) => {
    const { name, email, password, confirmPassword } = req.body
  
    // Validate User Schema
    const { error } = userSchema.validate({ name, email, password, confirmPassword }, { abortEarly: false })
  
    if (error) {
      const errors = error.details.map((detail) => detail.message);
      return res.status(422).send(errors);
    }
  
    
    const existingUser = await db.collection("user").findOne({ email })
    if (existingUser) {
      return res.status(409).send("User with this email already exists")
    }
  
    
    const hashedPassword = await bcrypt.hash(password, 10)
  
   
    const result = await db.collection("user").insertOne({
      name,
      email,
      password: hashedPassword,
      createdAt: new Date(),
    })
  
    res.status(201).send(result.ops[0])
  })


// Port Server
const PORT = 5000
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`))