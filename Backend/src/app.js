import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

const app = express()

app.use(cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173' ,
    methods: ['GET', 'POST','PATCH', 'PUT', 'DELETE'],
    credentials: true
}))


app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended: true, limit: "16kb"}))
app.use(express.static("public"))
app.use(cookieParser())


import userRouter from './routes/user.routes.js'
import drawRouter from './routes/draw.routes.js'
import tagsRouter from './routes/tags.routes.js'
import todoRouter from './routes/todo.routes.js'
import notesRouter from './routes/notes.routes.js'
import diaryRouter from './routes/diary.routes.js'
import monthlyRouter from './routes/monthlyGoal.routes.js'
import calendarRouter from './routes/calendar.routes.js'

app.get("/", (req, res) => {
    res.json({ message:"Hello, Backend!" })
})

app.use('/v1/user',userRouter)
app.use('/v1/draw',drawRouter)
app.use('/v1/tags',tagsRouter)
app.use('/v1/todo',todoRouter)
app.use('/v1/notes',notesRouter)
app.use('/v1/diary',diaryRouter)
app.use('/v1/monthly', monthlyRouter)
app.use('/v1/calendar', calendarRouter)

export { app }