import { Router } from "express";
import { body } from "express-validator";
import {
    createAccount,
    login,
    getUser,
    updateProfle,
    uploadImage
} from "./handlers";
import { handleInputError } from "./middlewares/validations";
import { authenticate } from "./middlewares/auth";

const router = Router();

router.post("/auth/register",
    body("handle").notEmpty().withMessage("Handle cannot be empty"),
    body("name").notEmpty().withMessage("Name cannot be empty"),
    body("email").isEmail().withMessage("Email is not valid"),
    body("password").isLength({ min: 8 }).withMessage("Password must be at least 8 characters long"),
    handleInputError,
    createAccount);

router.post("/auth/login",
    body("email").isEmail().withMessage("Email is not valid"),
    body("password").notEmpty().withMessage("Password cannot be empty"),
    handleInputError,
    login);

router.get("/user", authenticate, getUser);

router.patch("/user",
    body("handle").notEmpty().withMessage("Handle cannot be empty"),
    body("description").notEmpty().withMessage("Name cannot be empty"),
    authenticate, updateProfle);

router.post("/user/image", authenticate, uploadImage);

export default router;