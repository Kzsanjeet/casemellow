import express, { Request, Response } from "express";
import dotenv from "dotenv";

dotenv.config()
const app =  express()

const port = process.env.PORT || 4000;

app.get("/",(req:Request, res:Response)=>{
    res.send("Hello World");
})

app.use(express.json())

app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
});
 