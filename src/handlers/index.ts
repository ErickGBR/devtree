import { Request, Response } from "express";
import { validationResult } from "express-validator";
import User from "../models/User";
import { hashPassword , checkPassword} from "../utils/auth";

export const createAccount = async (req: Request, res: Response): Promise<void> => {
    const slug = (await import('slug')).default;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(422).json({ errors: errors.array() });
    }

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
    res.status(201).json(user);

}


export const login = async (req: Request, res: Response): Promise<void> => {

    // Validate request body
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(422).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    // Check if user exist
    const user = await User.findOne({ email });
    if (!user) {
        const error = new Error("User not found");
        res.status(404).json({
            message: error.message
        })
    }


    const isPassword = await checkPassword(password, user.password)
    // Check if password is correct
    if (!isPassword) {
        const error = new Error("Invalid password");
        res.status(401).json({
            message: error.message
        })
    }

}

