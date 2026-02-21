import mongoose, { Schema } from "mongoose";

const likesSchema = new Schema(
  {
    channel: {
      type: Schema.Types.ObjectId, //user id
      ref: "User",
    },

    videoId: {
      type: Schema.Types.ObjectId, //users video
      ref: "Video",
    },
    isLiked: {
      type: Boolean,
    },
  },
  {
    timeStamps: true,
  }
);

export const Likes = mongoose.model("Likes", likesSchema);
