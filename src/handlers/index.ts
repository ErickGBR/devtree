import { Request, Response } from "express";
import User from "../models/User";
import jwt from "jsonwebtoken";
import { generateJWT } from "../utils/jwt";

import { hashPassword , checkPassword} from "../utils/auth";

export const createAccount = async (req: Request, res: Response): Promise<void> => {
    const slug = (await import('slug')).default;

    const { email, password } = req.body;
    const userExist = await User.findOne({ email });

    if (userExist) {
        const error = new Error("This user already exist!");
        res.status(409).json({
            message: error.message
        })
    }

    const handle = slug(req.body.handle, "");
    const handleExist = await User.findOne({ handle });
    if (handleExist) {
        const error = new Error("This handle already exist!");
        res.status(409).json({
            message: error.message
        })
    }

    const user = new User(req.body);
    user.password = await hashPassword(password);
    user.handle = handle;

    await user.save();
    res.status(201).send("User created successfully");

}


export const login = async (req: Request, res: Response): Promise<void> => {

    const { email, password } = req.body;

    // Check if user exist
    const user = await User.findOne({ email });
    if (!user) {
        const error = new Error("User not found");
        res.status(404).send(error.message);
    }


    const isPassword = await checkPassword(password, user.password)
    // Check if password is correct
    if (!isPassword) {
        const error = new Error("Invalid password");
        res.status(401).send(error.message);
    }

    const token = generateJWT({user: user._id});
    res.status(200).send(token);

}


export const getUser = async (req: Request, res: Response): Promise<void> => {

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
        if(typeof result === "object" && result.id){
            const user = await User.findById(result.id).select("name email handle");
            if(!user){
                const error = new Error("User not found");
                res.status(404).json(error.message);
            }
            res.status(200).json(user);
        }
    } catch (error) {
        res.status(401).json(error.message);
    }
}