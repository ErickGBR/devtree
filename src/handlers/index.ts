import { Request, Response, NextFunction } from "express";
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
        return;
    }

    const isPassword = await checkPassword(password, user?.password)

    // Check if password is correct
    if (!isPassword) {
        const error = new Error("Invalid password");
        res.status(401).send(error.message);
        return;
    }

    const token = generateJWT({ user: user._id });
    res.status(200).send(token);
    return;

}


export const getUser = async (req: Request, res: Response): Promise<void> => {
    res.status(200).json(req.user);
}


export const updateProfle = async (req: Request, res: Response): Promise<void> => {
    try {

        const slug = (await import('slug')).default;
        const { description, links } = req.body;
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
        req.user.links = links
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
        form.parse(req, (err, fields, files) => {
            if (err) {
                console.error(err);
                res.status(500).send("Error parsing the file");
                return;
            }
        });
        // Parse the form data

        const parseForm = (): Promise<{ fields: formidable.Fields, files: formidable.Files }> => {
            return new Promise((resolve, reject) => {
                form.parse(req, (err, fields, files) => {
                    if (err) reject(err);
                    else resolve({ fields, files });
                });
            });
        };

        const { files } = await parseForm();

        const file = files.file as formidable.File | formidable.File[]; // can be a single file or an array of files
        const filepath = Array.isArray(file) ? file[0].filepath : file.filepath;

        // upload the image to cloudinary
        const result = await cloudinary.uploader.upload(filepath, {
            public_id: uuid(),
        });

        // create a new user image
        req.user.image = result.secure_url;
        await req.user.save();

        res.status(200).json({ image: result.secure_url });
    } catch (error) {
        console.error(error);
        res.status(500).send("Error uploading image");
    }
};


export const getUserByHandle = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { handle } = req.params;
        const user = await User.findOne({ handle }).select("-password -email -__v -_id");
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }

        res.status(200).json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching user" });
    }
};




export const searchByHandle = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { handle } = req.params;
        const userExist = await User.findOne({ handle });
        if (userExist) {
            res.status(409).json({ message: "User "+handle+" is already taken" });
            return;
        }
        res.status(200).json({ message: "User "+handle+" is available" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching user" });
    }
};