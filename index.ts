import express from 'express'
import mongoose from 'mongoose'
import { jwt } from './src/security/AuthMiddleware'
import errorHandler from "./src/error/errorsMiddleware";
import adminRouter from "./src/controller/AdminController";
import artistRouter from "./src/controller/ArtistController";
import authRouter from "./src/controller/LoginController";
import registerRouter from "./src/controller/RegisterController";
import managerRouter from "./src/controller/ManagerController";
import dotenv from 'dotenv';

dotenv.config();

const url: string = process.env.MONGO_URL ?? '';

mongoose
    .connect(url)
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch(err => {
        console.log('Error while connecting to MongoDB', err);
    });

const app = express()

app.use(express.json())
app.use(jwt())
app.use(errorHandler)

app.get('/', (req, res) => {
    res.send('Hello World');
})

app.use('/admin', adminRouter);
app.use('/artist', artistRouter);
app.use('/auth', authRouter);
app.use('/auth', registerRouter);
app.use('/manager', managerRouter);

app.listen(3000, () => {
    console.log('Server is running on port 3000');
})
