import { Request, Response } from "express";
import {prisma} from "../config/prisma.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';


const genrateToken = (id: String) =>{

    return jwt.sign({id}, process.env.JWT_SECRET as string, {expiresIn: "1h"});
}

const getAdminStatus = (email: string | null | undefined) : boolean => {
    if (!email) return false;
    const adminEmail = process.env.ADMIN_EMAIL?.toLowerCase();
    return email.toLowerCase() === adminEmail;
}


// Register
// POST /api/auth/register
export const register = async (req: Request, res: Response) =>{

    const {name, email, password} = req.body;

    if(!name || !email || !password) {
        return res.status(400).json({message: "Please provide all required fields"});
    }

    const existingUser = await prisma.user.findUnique({where : {email: email.toLowerCase()}});

    if(existingUser){
        return res.status(400).json({message : "User already exists"});
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const  user = await prisma.user.create({
        data : {name, email:email.toLowerCase(), password: hashedPassword}
        
    })

    const token = genrateToken(user.id);

    const userdata: any = {...user};
    delete userdata.password;
    userdata.isAdmin = getAdminStatus(userdata.email);

    res.status(201).json({user: userdata, token});
    
    
}

// Login
// POST /api/auth/login
export const login = async (req: Request, res: Response) =>{

    const {email, password} = req.body;

    if( !email || !password) {
        return res.status(400).json({message: "Please provide email and password"});
    }

    const user = await prisma.user.findUnique({where : {email: email.toLowerCase()}, includes: {addresses: true}});

    if(!user){
        return res.status(401).json({message : "User does not exist"});
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if(!isMatch){
        res.status(401).json({message : "Password Invalid"})
    }

    const token = genrateToken(user.id);

    const userdata: any = {...user};
    delete userdata.password;
    userdata.isAdmin = getAdminStatus(userdata.email);

    res.json({user: userdata, token});
    
    
}