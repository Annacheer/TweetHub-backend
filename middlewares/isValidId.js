const { isValidObjectId } = require("mongoose");

const isValidId = (req, res, next) => {
  const { tweetId } = req.params;
  if (!isValidObjectId(tweetId)) {
    return res.status(400).json({ message: `${tweetId} is not a valid id` });
  }
  next();
};
module.exports = isValidId;
