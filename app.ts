import express from 'express';
import dotenv from 'dotenv';
import user from './src/Routers/user';

dotenv.config({path:'.env'});


const app = express();

app.use(express.json());
app.use(express.urlencoded({extended:true}));


app.use('/api',user)

app.get('/',(req,res)=>{
    res.status(200).send("Welcome to Home Page");
})


const PORT = process.env.PORT || 3000;
app.listen(PORT,()=>{
    console.log(`Server is listening on PORT : ${PORT}`)
})