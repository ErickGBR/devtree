import { Request, Response } from "express";
import User from "../models/User";

export const createAccount = async (req: Request, res: Response) => {
    const { email } = req.body;
    const userExist = await User.findOne({ email });

    if(userExist) {
        const error = new Error("This user already exist!");
        res.status(409).json({
            message: error.message
        })
    }else {
        const user = new User(req.body);
        await user.save();
        res.status(200).json(user);
    }

}


