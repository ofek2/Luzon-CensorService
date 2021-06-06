import { Router } from "express";
import { StorageResources } from "../enums/StorageResources";
import { ListsController } from "../controllers/ListsController";

const listsRouter = Router();

// Whitelist routes
listsRouter.get(
  "/whitelist",
  ListsController.createGetFromListFunction(StorageResources.WHITELIST)
);

listsRouter.post(
  "/whitelist",
  ListsController.validateWhitelistWordCreation,
  ListsController.createWordInWhitelist
);

listsRouter.put(
  "/whitelist",
  ListsController.validateWhitelistWordCreation,
  ListsController.createWordInWhitelist
);

// Graylist routes
listsRouter.get(
  "/graylist",
  ListsController.createGetFromListFunction(StorageResources.GRAYLIST)
);

listsRouter.post(
  "/graylist",
  ListsController.updateWordsInGraylist
);

listsRouter.delete(
  "/graylist/:word",
  ListsController.deleteWordFromGraylist
);

// Blacklist routes
listsRouter.get(
  "/blacklist",
  ListsController.createGetFromListFunction(StorageResources.BLACKLIST)
);

listsRouter.post(
  "/blacklist",
  ListsController.validateBlacklistWordCreation,
  ListsController.createWordInBlacklist
);

listsRouter.delete(
  "/blacklist/:word",
  ListsController.deleteWordFromBlacklist
);

export { listsRouter }