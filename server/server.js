import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { PrismaClient } from '@prisma/client'

// Importar rotas
import authRoutes from './src/auth/auth.routes.js'
import userRoutes from './src/routes/user.routes.js'

dotenv.config()

const app = express()
app.use(cors())
app.use(express.json())

const PORT = process.env.PORT || 3000

app.get('/', (req, res) => {
  res.send('Server is running')
})

// Usar rotas
app.use('/auth', authRoutes)
app.use('/user', userRoutes)

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
