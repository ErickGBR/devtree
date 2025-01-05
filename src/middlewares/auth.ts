
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User, { IUser } from "../models/User";

declare global {
    namespace Express {
        interface Request {
            user?: IUser;
        }
    }
}

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
    const bearer = req.headers.authorization;
    /**
     * Check if bearer token exist
     */
    if(!bearer){
        const error = new Error("Unauthorized");
        res.status(401).json(error.message);
    }

    const [, token] = bearer.split(" ");
    
    /**
     * Check if token is valid
     */
    if(!token){
        const error = new Error("Unauthorized");
        res.status(401).json(error.message);
    }

    /**
     * Verify jwt token
     */
    try {
        const result = jwt.verify(token, process.env.JWT_SECRET as string);
        if(typeof result === "object" && result.user){
            const user = await User.findById(result.user).select("-password");
            if(!user){
                const error = new Error("User not found");
                res.status(404).json(error.message);
            }
            req.user = user;
            next();
        }
    } catch (error) {
        res.status(401).json(error.message);
    }
}