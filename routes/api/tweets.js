const express = require("express");
const ctrl = require("../../controllers/tweets");
const { isValidId, validateBody, authenticate } = require("../../middlewares");
const { schemas } = require("../../models/tweet");

const router = express.Router();

router.get("/", authenticate, ctrl.getAll);

router.get("/:tweetId", authenticate, isValidId, ctrl.getById);

router.post("/", authenticate, validateBody(schemas.addSchema), ctrl.add);

router.delete("/:tweetId", authenticate, isValidId, ctrl.deleteById);

router.put(
  "/:tweetId",
  authenticate,
  validateBody(schemas.addSchema),
  isValidId,
  ctrl.updateById
);

module.exports = router;
