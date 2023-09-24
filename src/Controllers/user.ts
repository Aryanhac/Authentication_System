import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import validator from 'validator';



const prisma = new PrismaClient();


// Register
const register = async (req : Request,res : Response)=>{
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: 'All fields are required.' });
    }
  
    if (!validator.isEmail(email)) {
      return res.status(400).json({ message: 'Invalid email address.' });
    }
  
    try {
      // Check if the username is already taken
      const existingUser = await prisma.user.findUnique({ where: { email } });
  
      if (existingUser) {
        return res.status(400).json({ message: 'Email already taken.' });
      }
  
      // Hash the password before storing it
      const hashedPassword = await bcrypt.hash(password, 10);
      const date=new Date();
      const createdAt=date.toDateString();
      
      // Create a new user
      const newUser = await prisma.user.create({
        data: {
          username,
          email,
          password: hashedPassword,
          createdAt
        },
      });

      return res.status(200).json({ message: 'User registered successfully.', user: newUser });

    } catch (error) {
      console.error('Error registering user:', error);
      return res.status(500).json({ message: 'Internal server error.' });
    }
   
};

// log In
const logIn= (req : Request,res : Response)=>{
   return res.status(200).json({message:"logged In succesfully"});
};

//logged Out
const logOut=(req : Request,res : Response)=>{

  req.logout((err) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Logout failed');
    }
    res.redirect('/');
  });

}

// //Send Token 
// const sendToken=(user: { id: any; email?: string; username?: string; password?: string; createdAt?: string; },res:Response)=>{

//   const secretKey = process.env.JWT_SECRET_ID || 'default-secret-key'; // Provide a default secret key if not set
//   const expiresIn = process.env.JWT_EXPIRE || '1h'; // Provide a default expiration time if not set

//   const token= jwt.sign({id:user.id},secretKey,{
//                    expiresIn
//                 });
  
//   const currentTime: number = Date.now();
//   const cookieExpireMilliseconds: number = Number(process.env.COOKIE_EXPIRE) * 24 * 60 * 60 * 1000;
//   const expirationTime: number = currentTime + cookieExpireMilliseconds;
                
//   const options={
//       expires: new Date(expirationTime),
//       httpOnly:true
//   }
//   //save in cookie
//   res.status(200).cookie("token",token,options).json({
//       success:true,
//       user,
//       token
//   })
// }

export {register,logIn,logOut}
