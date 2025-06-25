import  { Request, Response } from "express";
import bcrypt from "bcrypt"
import jwt, { JwtPayload } from "jsonwebtoken"
import { prismaClient } from "@repo/db/db";
import { Authrequest } from "../middleware/middleware";
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

export const createroom=async (req:Authrequest,res:Response)=>{
    const roomid = crypto.randomUUID()
    const roomname = req.body.roomname
    try {
        const room = await prismaClient.room.create({
            data:{
                id:roomid,
                userId:req.userid as string,
                roomname:roomname
            }
        })
        res.json({room,roomname})
    } catch (error) {
        console.error("Error creating room:", error);
        res.status(500).json({ error: "Failed to create room" });
    }
}

export const getrooms = async (req:Request,res:Response)=>{
    try {
        const rooms = await prismaClient.room.findMany({
            orderBy:{
                createdAt: 'desc'
            },
            select:{
                roomname:true,
                id:true,
            }
        })
        res.json({rooms})
    } catch (error) {
        console.error("Error fetching rooms:", error);
        res.status(500).json({ error: "Failed to fetch rooms" });
    }
}