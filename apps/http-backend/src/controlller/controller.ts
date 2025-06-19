import  { Request, Response } from "express";
import bcrypt from "bcrypt"
import jwt, { JwtPayload } from "jsonwebtoken"
import { prismaClient } from "@repo/db/db";
export const signup = async (req:Request,res:Response)=>{
    const {username,email,password} = req.body
    if(!username&&!email&&password)return ;
const hashedpassword=await bcrypt.hash(password,10)
const user =await prismaClient.user.create({
    data:{
        email:email,
        password:hashedpassword,
        username:username
    }
})
const JWTSECRET =process.env.Secret
const token = jwt.sign({
    id:user.id
},JWTSECRET as string) 


res.json({
    token:token
})
}

export const signin=async (req:Request,res:Response)=>{
    const {email,password} = req.body
    if(!email&&!password)return 
    const user = await prismaClient.user.findFirst({
        where:{
            email:email
        }
    })
    if (!user || !user.password) {
        return res.status(401).json({ error: "Invalid email or password" });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        return res.status(401).json({ error: "Invalid email or password" });
    }
    
    const JWTSECRET = process.env.Secret;
    const token = jwt.sign(
        { id: user.id },
        JWTSECRET as string
    );
    res.json({ token: token });
}