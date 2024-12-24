import { Router } from "express";
import { body } from "express-validator";
import { createAccount, login } from "./handlers";

const router = Router();

router.post("/auth/register",
    body("handle").notEmpty().withMessage("Handle cannot be empty"),
    body("name").notEmpty().withMessage("Name cannot be empty"),
    body("email").isEmail().withMessage("Email is not valid"),
    body("password").isLength({ min: 8 }).withMessage("Password must be at least 8 characters long"),
    createAccount);


router.post("/auth/login",
    body("email").isEmail().withMessage("Email is not valid"),
    body("password").notEmpty().withMessage("Password cannot be empty"),
    login);

export default router;
