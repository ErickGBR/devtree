import { Request, Response } from "express";
import User from "../models/User";
import formidable from "formidable";
import { v4 as uuid } from "uuid";
import cloudinary from "../config/cloudinary";
import { generateJWT } from "../utils/jwt";
import { hashPassword, checkPassword } from "../utils/auth";



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

    const token = generateJWT({ user: user._id });
    res.status(200).send(token);

}


export const getUser = async (req: Request, res: Response): Promise<void> => {
    res.status(200).json(req.user);
}


export const updateProfle = async (req: Request, res: Response): Promise<void> => {
    try {

        const slug = (await import('slug')).default;
        const { description } = req.body;
        const handle = slug(req.body.handle, "");

        const handleExist = await User.findOne({ handle });
        
        if (handleExist && handleExist.email !== req.user.email) {
            const error = new Error("This handle already exist!");
            res.status(409).json({
                message: error.message
            })
        }

        req.user.handle = handle;
        req.user.description = description;
        req.user.save();

        res.status(200).send("Profile updated successfully");

    } catch (error) {
        console.log(error)
        res.status(500).send(error.message);
    }
}


export const uploadImage = async (req: Request, res: Response): Promise<void> => {
    try {

        const form = formidable({ multiples: false });
        form.parse(req, async (err, fields, files) => {
            console.log(files.file[0].filepath, { public_id: uuid() }, async function (error, result) {
                if (error) {
                    const error = new Error("Error uploading image");
                    res.status(500).send(error.message);
                }

                if (result) {
                    req.user.image = result.secure_url;
                    await req.user.save();
                    res.json({image: result.secure_url})
                }
                
            })
            cloudinary.uploader.upload(files.file[0].filepath)
        });
        

        res.status(200).send("Profile updated successfully");

    } catch (error) {
        res.status(500).send(error.message);
    }
}