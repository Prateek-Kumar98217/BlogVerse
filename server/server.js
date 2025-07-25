import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import connectDb from './configs/db.js'
import adminRouter from './routes/adminRoutes.js'
import blogRouter from './routes/blogRoutes.js'
dotenv.config()
const app=express()
await connectDb()
//middleware
app.use(cors())
app.use(express.json())


const PORT=process.env.PORT||3000

app.get("/",(req,res)=>{
res.send("Api is working")
})
app.use("/api/admin",adminRouter)
app.use("/api/blog",blogRouter)
app.listen(PORT,()=>{
    console.log(`Server is running on ${PORT}`)
})


export default app