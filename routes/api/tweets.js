const express = require("express");
const ctrl = require("../../controllers/tweets");
const { isValidId, validateBody, authenticate } = require("../../middlewares");
const { schemas } = require("../../models/tweet");

const router = express.Router();

// router.get("/", async (req, res, next) => {
//   try {
//     const result = await Tweet.find();
//     res.json(result);
//   } catch (error) {
//     next(error);
//   }
// });
router.get("/", authenticate, ctrl.getAll);

// router.get("/:tweetId", isValidId, async (req, res, next) => {
//   try {
//     const { tweetId } = req.params;
//     const result = await Tweet.findById(tweetId);
//     if (!result) {
//       throw HttpError(404, "Not found");
//     }
//     res.json(result);
//   } catch (error) {
//     next(error);
//   }
// });

router.get("/:tweetId", authenticate, isValidId, ctrl.getById);

// router.post("/", async (req, res, next) => {
//   try {
//     const requiredFields = ["name", "tweet"];
//     for (const field of requiredFields) {
//       if (req.body[field] === undefined) {
//         return res
//           .status(400)
//           .json({ message: `missing required ${field} field` });
//       }
//     }

//     const { error } = schemas.addSchema.validate(req.body);
//     if (error) {
//       return res.status(400).json({ message: error.message });
//     }

//     const result = await Tweet.create(req.body);
//     res.status(201).json(result);
//   } catch (error) {
//     next(error);
//   }
// });

router.post("/", authenticate, validateBody(schemas.addSchema), ctrl.add);

// router.delete("/:tweetId", isValidId, async (req, res, next) => {
//   try {
//     const { tweetId } = req.params;
//     const result = await Tweet.findByIdAndDelete(tweetId);
//     if (!result) {
//       throw HttpError(404, "Not found");
//     }
//     res.status(200).json({ message: "tweet deleted" });
//   } catch (error) {
//     next(error);
//   }
// });

router.delete("/:tweetId", authenticate, isValidId, ctrl.deleteById);

// router.put("/:tweetId", isValidId, async (req, res, next) => {
//   try {
//     if (Object.keys(req.body).length === 0) {
//       return res.status(400).json({ message: "missing fields" });
//     }

//     const { error } = schemas.addSchema.validate(req.body);
//     if (error) {
//       return res.status(400).json({ message: error.message });
//     }

//     const { tweetId } = req.params;
//     const updatedTweet = await Tweet.findByIdAndUpdate(tweetId, req.body, {
//       new: true,
//     });

//     if (!updatedTweet) {
//       return res.status(404).json({ message: "Not found" });
//     }

//     res.status(200).json(updatedTweet);
//   } catch (error) {
//     next(error);
//   }
// });

router.put(
  "/:tweetId",
  authenticate,
  validateBody(schemas.addSchema),
  isValidId,
  ctrl.updateById
);

module.exports = router;
