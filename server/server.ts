import "dotenv/config";
import express, {Request, Response} from "express";
import cors from "cors";
import authRouter from "./routes/authRoutes.js";


const app = express();

//  Middleware

app.use(cors());
app.use(express.json());

app.get("/", (req:Request , res:Response) =>{
    console.log('Server is running')
})

app.use('/api/auth', authRouter);

const port = process.env.PORT || 5000;

app.listen(port, () =>{
    console.log(`Server is running at http://localhost:${port}`);

})