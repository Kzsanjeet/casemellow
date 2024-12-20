import express, { Request, Response} from "express";
import dotenv from "dotenv";

import connectDb from "./dbConnect";
import registerRouter from "./users/routes/user.routes/registerRoute";
import loginRouter from "./users/routes/user.routes/loginRoute";
import brandRouter from "./users/routes/brand.routes/brandRoute";
import phoneModelRouter from "./users/routes/phoneModel.routes/phoneModelRoutes";

dotenv.config()
const app =  express()
const port = process.env.PORT || 4000;
connectDb()

app.get("/",(req:Request, res:Response)=>{
    res.send("Hello World");
})

app.use(express.json())
// app.use(urlencoded())

// routes
app.use("/api/v1",
    registerRouter,
    loginRouter
)
app.use("/api/v1/admin",
    brandRouter,
    phoneModelRouter
)

app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
});
 