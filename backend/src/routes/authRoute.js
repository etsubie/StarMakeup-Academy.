import express from "express"
import { login, logout, register } from "../controller/authController.js"
import verifyToken from "../middleware/authMiddleware.js"

const authRouter = express.Router()

authRouter.post('/register', register)
authRouter.post('/login', login)
authRouter.post('/logout', verifyToken, logout)

export default authRouter