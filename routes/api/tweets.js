const express = require("express");
const { Tweet, schemas } = require("../../models/tweet");
const { HttpError } = require("../../helpers");
const isValidId = require("../../middlewares");

const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const result = await Tweet.find();
    res.json(result);
  } catch (error) {
    next(error);
  }
});

router.get("/:tweetId", isValidId, async (req, res, next) => {
  try {
    const { tweetId } = req.params;
    const result = await Contact.findById(tweetId);
    if (!result) {
      throw HttpError(404, "Not found");
    }
    res.json(result);
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const requiredFields = ["name", "tweet"];
    for (const field of requiredFields) {
      if (req.body[field] === undefined) {
        return res
          .status(400)
          .json({ message: `missing required ${field} field` });
      }
    }

    const { error } = schemas.addSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.message });
    }

    const result = await Tweet.create(req.body);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
});

router.delete("/:tweetId", isValidId, async (req, res, next) => {
  try {
    const { tweetId } = req.params;
    const result = await Tweet.findByIdAndDelete(tweetId);
    if (!result) {
      throw HttpError(404, "Not found");
    }
    res.status(200).json({ message: "tweet deleted" });
  } catch (error) {
    next(error);
  }
});

router.put("/:tweetId", isValidId, async (req, res, next) => {
  try {
    if (Object.keys(req.body).length === 0) {
      return res.status(400).json({ message: "missing fields" });
    }

    const { error } = schemas.addSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.message });
    }

    const { tweetId } = req.params;
    const updatedTweet = await Tweet.findByIdAndUpdate(tweetId, req.body, {
      new: true,
    });

    if (!updatedTweet) {
      return res.status(404).json({ message: "Not found" });
    }

    res.status(200).json(updatedTweet);
  } catch (error) {
    next(error);
  }
});

module.exports = router;