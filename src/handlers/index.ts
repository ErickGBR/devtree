import { Request, Response } from "express";
import User from "../models/User";
import { hashPassword } from "../utils/auth";
export const createAccount = async (req: Request, res: Response) => {
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
    res.status(200).json(user);

}


