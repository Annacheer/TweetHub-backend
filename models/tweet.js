const { Schema, model } = require("mongoose");
const { handleMongooseError } = require("../helpers");
const Joi = require("joi");

const tweetSchema = new Schema(
  {
    // name: {
    //   type: String,
    //   required: [true, "Set your name"],
    // },
    tweet: {
      type: String,
    },
  },
  { versionKey: false }
);

tweetSchema.post("save", handleMongooseError);

const addSchema = Joi.object({
  // name: Joi.string().required(),
  tweet: Joi.string().required(),
});

const schemas = {
  addSchema,
};

const Tweet = model("tweet", tweetSchema);

module.exports = {
  Tweet,
  schemas,
};
