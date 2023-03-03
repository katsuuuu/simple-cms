const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const PostSchema = new Schema(
  {
    title: String | Number,
    summary: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
      enum: ["Option1", 1],
    },
    author: { type: Schema.Types.ObjectId, ref: "User" },
  },
  {
    timestamps: true,
  }
);

const PostModel = model("Post", PostSchema);

module.exports = PostModel;
// title: Schema.Types.Mixed
// summary: Schema.Types.Mixed

// myField: {
//   type: mongoose.Schema.Types.Mixed,
//   required: true,
//   enum: ['Option1', 'Option2', 1, 2, 3] // allowed values for the field
// }
