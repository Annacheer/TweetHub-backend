const { Schema, model } = require("mongoose");
const { handleMongooseError } = require("../helpers");
const Joi = require("joi");

const tweetSchema = new Schema(
  {
    tweet: {
      type: String,
      required: true,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
  },
  { versionKey: false }
);

tweetSchema.post("save", handleMongooseError);

const addSchema = Joi.object({
  tweet: Joi.string().required(),
});
// const addSchema = Joi.object({
//   tweet: Joi.string().required().messages({
//     "string.base": `"tweet" should be a type of 'text'`,
//     "string.empty": `empty string`,
//     "any.required": `missing field`,
//   }),
// });
const schemas = {
  addSchema,
};

const Tweet = model("tweet", tweetSchema);

module.exports = {
  Tweet,
  schemas,
};
