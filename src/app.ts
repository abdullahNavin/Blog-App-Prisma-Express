import express, { Application } from 'express'
import { postRoutes } from './modules/posts/posts.routes';
import { toNodeHandler } from "better-auth/node";
import { auth } from './lib/auth';
import cors from 'cors';
import { commentRoutes } from './modules/comments/comments.routes';

const app: Application = express()


app.use(express.json())

app.use(cors({
    origin: process.env.APP_URL || 'http://localhost:5000',
    credentials: true
}))



app.get('/', (req, res) => {
    res.send('this server')
})

app.all("/api/auth/*splat", toNodeHandler(auth));

app.use('/post', postRoutes)

app.use('/comment', commentRoutes)

export default app;