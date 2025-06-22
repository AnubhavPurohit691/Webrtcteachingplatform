import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken"
export interface Authrequest extends Request {
    userid?: string  // Optional user property to hold decoded JWT
}
export const authmiddleware = (req: Authrequest, res: Response, next: NextFunction) => {
    const token = req.header("Authorization")?.split(' ')[1]
    if (!token) {
        return res.status(401).json({ error: "Unauthorized" });
    }
    try {
        const decoded = jwt.verify(token, process.env.Secret as string) as JwtPayload;
        req.userid = decoded.id; // Attach user info to request object
    } catch (error) {
        return res.status(401).json({ error: "Invalid token" });
    }
    next();
}