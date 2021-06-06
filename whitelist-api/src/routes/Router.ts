
import { Router } from "express";
import { listsRouter } from "./ListsRouter";

const router = Router();

// Users routes
router.use('/lists', listsRouter);

export { router }