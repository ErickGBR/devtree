import { Request, Response } from "express";
import User from "../models/User";
import { hashPassword } from "../utils/auth";
export const createAccount = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const userExist = await User.findOne({ email });

    if(userExist) {
        const error = new Error("This user already exist!");
        res.status(409).json({
            message: error.message
        })
    }else {
        const user = new User(req.body);
        user.password = await hashPassword(password);
        await user.save();
        res.status(200).json(user);
    }

}


