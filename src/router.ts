import { Router } from "express";

const router = Router();

router.post("/auth/register", (req, res) => {
    res.send(" hello world");
})

export default router;
