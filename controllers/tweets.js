const { Tweet, schemas } = require("../models/tweet");
const { HttpError, ctrlWrapper } = require("../helpers");

const getAll = async (req, res) => {
  const { _id: owner } = req.user;
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  const result = await Tweet.find({ owner })
    .skip(skip)
    .limit(limit)
    .populate("owner", "name email");
  res.json(result);
};

const getById = async (req, res) => {
  const { tweetId } = req.params;
  const { _id: owner } = req.user;
  const result = await Tweet.findOne({ _id: tweetId, owner });
  if (!result) {
    throw HttpError(404, "Not found");
  }
  res.json(result);
};

const add = async (req, res) => {
  // if (req.body.tweet === undefined) {
  //   return res.status(400).json({ message: "missing required tweet field" });
  // }
  const { _id: owner } = req.user;
  const newTweet = new Tweet({ tweet: req.body.tweet, owner });
  await newTweet.save();
  const populatedTweet = await newTweet.populate("owner", "name");
  const result = {
    userName: populatedTweet.owner.name, // Send the user's name along with the tweet
    tweet: populatedTweet.tweet,
  };
  res.status(201).json(result);
};

const updateById = async (req, res) => {
  // if (Object.keys(req.body).length === 0) {
  //   return res.status(400).json({ message: "missing field" });
  // }
  const { tweetId } = req.params;
  const { _id: owner } = req.user;
  const updatedTweet = await Tweet.findOneAndUpdate(
    { _id: tweetId, owner },
    req.body,
    {
      new: true,
    }
  );
  if (!updatedTweet) {
    return res.status(404).json({ message: "Not found" });
  }
  res.status(200).json(updatedTweet);
};

const deleteById = async (req, res) => {
  const { tweetId } = req.params;
  const { _id: owner } = req.user;
  const result = await Contact.findOneAndDelete({ _id: tweetId, owner });
  if (!result) {
    throw HttpError(404, "Not found");
  }
  res.status(200).json({ message: "tweet deleted" });
};

module.exports = {
  getAll: ctrlWrapper(getAll),
  getById: ctrlWrapper(getById),
  add: ctrlWrapper(add),
  updateById: ctrlWrapper(updateById),
  deleteById: ctrlWrapper(deleteById),
};
