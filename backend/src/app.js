// src/app.js
import express from 'express'
import cors from 'cors'
import path from 'path'
import { fileURLToPath } from 'url'
import employeeRoutes from './routes/employee.routes.js'
import authRoutes from './routes/auth.routes.js'
import rolesRoutes from './routes/roles.routes.js'
import viaticRoutes from './routes/viaticRates.routes.js'
import locationRoutes from './routes/location.routes.js'
import dotenv from 'dotenv'
dotenv.config()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()

// CORS (ajusta orígenes en producción)
app.use(cors())

// Para recibir JSON pequeños (aun cuando usamos multipart para avatar)
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ limit: '10mb', extended: true }))

// Servir archivos estáticos (uploads)
app.use('/uploads', express.static(path.join(__dirname, '../uploads')))

// Rutas
app.use('/api/employee', employeeRoutes)

app.use('/api/auth', authRoutes)

app.use('/api/roles', rolesRoutes)

app.use('/api/rates', viaticRoutes)

app.use('/api/locations', locationRoutes)


app.get('/api/saludo', (req, res) => res.json({ mensaje: 'Hola desde el backend 😎' }))

export default app
