import express from 'express'
import google, { signup, signin, signOut } from '../controllers/authController.js';
const authRouter = express.Router();

authRouter.post('/signup',signup)
authRouter.post('/signin', signin)
authRouter.post('/google', google)
authRouter.get('/signout', signOut)

export default authRouter;