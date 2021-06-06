import { Router } from "express";
import { TextController } from "../controllers/TextController";

const textRouter = Router();

textRouter.post(
  "/censor",
  TextController.isCreateCensorTextReqValid,
  TextController.createCensorText
);

export { textRouter }