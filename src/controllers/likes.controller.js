import { Likes } from "../models/likes.model.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

const setLikes = asyncHandler(async (req, res) => {
  //take user id from req.user._id
  //take video id from req.body

  const { videoId } = req.body;

  //find if the video is already liked
  const alreadyLiked = await Likes.findOne({
    channel: req.user._id,
    videoId: videoId,
    isLiked: true,
  });

  if (alreadyLiked) {
    await Likes.findByIdAndDelete(alreadyLiked._id);

    return res
      .status(200)
      .json(new ApiResponse(200, {}, "unliked successfully"));
  } else {
    const response = await Likes.create({
      channel: req.user._id,
      videoId: videoId,
      isLiked: true,
    });

    return res
      .status(200)
      .json(new ApiResponse(200, response, "Liked successfully"));
  }
});

export { setLikes };
