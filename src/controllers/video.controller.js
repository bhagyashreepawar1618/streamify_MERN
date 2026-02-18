import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiErrors.js";
import uploadOnCloudinary from "../utils/cloudinary.js";
import ApiResponse from "../utils/ApiResponse.js";
import { Video } from "../models/video.model.js";
import deleteFromCloudinary from "../utils/delteFromCloudinary.js";
//to get all videos for home page
const getVideos = asyncHandler(async (req, res) => {
  const videos = await Video.find({ isPublished: true })
    .sort({ createdAt: -1 })
    .populate("owner", "fullname username avtar");

  console.log("videos =", videos);
  return res
    .status(200)
    .json(new ApiResponse(200, videos, "videos fetched successfully"));
});

//secured routes
//to upload videos
const uploadVideos = asyncHandler(async (req, res) => {
  const { title, description } = req.body;
  //take video from user
  console.log("files=", req.files);
  const videoLocalPath = req.files?.videoFile?.[0].path; //multer

  const thumbnailLocalpath = req.files?.thumbnail?.[0].path;

  //if path is not defined throw an error
  if (!videoLocalPath) {
    throw new ApiError(404, "video path is not defined");
  }

  //if thumbnail is not present
  if (!thumbnailLocalpath) {
    throw new ApiError(404, "thumbnail path is not defined");
  }

  //if we got the local path upload it on cloudinary

  const videoFile = await uploadOnCloudinary(videoLocalPath);
  const thumbnail = await uploadOnCloudinary(thumbnailLocalpath);

  //if we did not get cloudinary url throw an error
  if (!videoFile.url && !thumbnail.url) {
    throw new ApiError(
      500,
      "Error Occured while uploading Video on Cloudinary.. "
    );
  }

  //if video is uploaded on cloudinary successfully then save it in data base
  const uservideo = await Video.create({
    videoFile: videoFile.url,
    thumbnail: thumbnail.url,
    title,
    description,
    owner: req.user._id,
  });

  const uploadedVideo = await Video.findById(uservideo._id);
  console.log("video info=", uploadedVideo);

  //if created user doesnot exists
  if (!uploadedVideo) {
    throw new ApiError(500, "Something went wrong while uploading video");
  }

  return res
    .status(201)
    .json(
      new ApiResponse(201, uploadedVideo, "video uploaded successfully...")
    );
});

//get user uploaded videos in user profile
const getUserVideos = asyncHandler(async (req, res) => {
  //find vedios of user
  //access user id with req.user
  const videos = await Video.find({ owner: req.user._id }).sort({
    createdAt: -1,
  });

  console.log("User videos=", videos);

  return res
    .status(200)
    .json(new ApiResponse(200, videos, "User videos fetched successfully"));
});

//delete uploaded videos
const deleteVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  const video = await Video.findById(videoId);

  if (!video) {
    throw new ApiError(404, "Video not found");
  }

  //if you are the owner or not
  if (video.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You are not allowed to delete this video");
  }

  //delete from cloudinary before deleting from db
  await deleteFromCloudinary(video.videoFile);
  await deleteFromCloudinary(video.thumbnail);

  const deletedVideo = await Video.findOneAndDelete({
    _id: videoId,
  });

  console.log("deleted video=", deletedVideo);

  if (!deletedVideo) {
    throw new ApiError(404, "Video not found or not authorized");
  }

  //if found
  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Video deleted successfully"));
});

export { getUserVideos, uploadVideos, getVideos, deleteVideo };
