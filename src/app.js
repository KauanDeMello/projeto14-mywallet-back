import express from "express"
import cors from "cors"
import bcrypt from 'bcrypt';
import { userSchema } from "./schema/user.schema.js"
import { userCollection } from './database/db.js'
import { v4 as uuid } from 'uuid';

const token = uuid();


// Server 
const app = express()

// Setup
app.use(express.json())
app.use(cors())




// Endpoints
app.post("/cadastro", async (req, res) => {
    const { name, email, password } = req.body

    const { error } = userSchema.validate({ name, email, password }, { abortEarly: false })

    if (error) {
      const errors = error.details.map((detail) => detail.message);
      return res.status(422).send(errors);
    }

    const existingUser = await userCollection.findOne({ email })

    if (existingUser) {
      return res.status(409).send("User with this email already exists")
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    try {
        const result = await userCollection.insertOne({
          name,
          email,
          password: hashedPassword,
        })
        res.status(201)
      } catch (error) {
        console.error(error)
        res.status(500).send("Internal Server Error")
      }

    })
// Port Server
const PORT = 5000
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`))