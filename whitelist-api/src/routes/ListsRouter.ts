import { Router } from "express";
import { StorageResources } from "../enums/StorageResources";
import { ListsController } from "../controllers/ListsController";
import { passportClient } from "../clients/passportClient";
import { Configuration } from "../../Configuration";

const listsRouter = Router();
const shouldActiveAuth = Configuration.authentication.shouldUseAuth;

// Whitelist routes
listsRouter.get(
  "/whitelist",
  passportClient.createLoggedInUserAuthorizeMiddleware({shouldRedirectToHome: false, shouldActive: shouldActiveAuth}),
  ListsController.createGetFromListFunction(StorageResources.WHITELIST)
);

listsRouter.post(
  "/whitelist",
  passportClient.createLoggedInUserAuthorizeMiddleware({shouldRedirectToHome: false, shouldActive: shouldActiveAuth}),
  ListsController.validateWhitelistWordCreation,
  ListsController.createWordInWhitelist
);

listsRouter.put(
  "/whitelist",
  passportClient.createLoggedInUserAuthorizeMiddleware({shouldRedirectToHome: false, shouldActive: shouldActiveAuth}),
  ListsController.validateWhitelistWordCreation,
  ListsController.createWordInWhitelist
);

// Graylist routes
listsRouter.get(
  "/graylist",
  passportClient.createLoggedInUserAuthorizeMiddleware({shouldRedirectToHome: false, shouldActive: shouldActiveAuth}),
  ListsController.createGetFromListFunction(StorageResources.GRAYLIST)
);

listsRouter.post(
  "/graylist",
  // passportClient.loggedInUserAuthorizeMiddleware,
  ListsController.updateWordsInGraylist
);

listsRouter.delete(
  "/graylist/:word",
  passportClient.createLoggedInUserAuthorizeMiddleware({shouldRedirectToHome: false, shouldActive: shouldActiveAuth}),
  ListsController.deleteWordFromGraylist
);

// Blacklist routes
listsRouter.get(
  "/blacklist",
  passportClient.createLoggedInUserAuthorizeMiddleware({shouldRedirectToHome: false, shouldActive: shouldActiveAuth}),
  ListsController.createGetFromListFunction(StorageResources.BLACKLIST)
);

listsRouter.post(
  "/blacklist",
  passportClient.createLoggedInUserAuthorizeMiddleware({shouldRedirectToHome: false, shouldActive: shouldActiveAuth}),
  ListsController.validateBlacklistWordCreation,
  ListsController.createWordInBlacklist
);

listsRouter.delete(
  "/blacklist/:word",
  passportClient.createLoggedInUserAuthorizeMiddleware({shouldRedirectToHome: false, shouldActive: shouldActiveAuth}),
  ListsController.deleteWordFromBlacklist
);

export { listsRouter }