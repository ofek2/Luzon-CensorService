
import { Router } from "express";
import { textRouter } from "./TextRouter";

const router = Router();

// Users routes
router.use('/text', textRouter);

export { router }