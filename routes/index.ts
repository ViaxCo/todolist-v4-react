import express from "express";
const router = express.Router();
import * as actions from "../controllers/items";

// Handle robots.txt and favicon.ico on the "/api/" route
router.route("/robots.txt").get(actions.preventFaviconAndRobots);
router.route("/favicon.ico").get(actions.preventFaviconAndRobots);
// Routes
router.route("/").get(actions.getLists);
router.route("/:id").delete(actions.deleteList);
router
  .route("/:customListName")
  .get(actions.getListItems)
  .post(actions.addListItem);
router
  .route("/:customListName/:id")
  .delete(actions.deleteListItem)
  .patch(actions.toggleItemCompleted);

export default router;
