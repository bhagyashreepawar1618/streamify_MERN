import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  getVideos,
  uploadVideos,
  getUserVideos,
  deleteVideo,
  getAnotherUserVideos,
} from "../controllers/video.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();
//get all videos
router.route("/get-videos").get(getVideos);

//get another user videos
router
  .route("/get-another-user-videos/:_id")
  .get(verifyJWT, getAnotherUserVideos);
//secured routes
//upload video
router.route("/upload-video").post(
  verifyJWT,
  upload.fields([
    {
      name: "videoFile",
      maxCount: 1,
    },
    {
      name: "thumbnail",
      maxCount: 1,
    },
  ]),
  uploadVideos
);

//get user videos
router.route("/get-user-videos").get(verifyJWT, getUserVideos);
//delete videos
router.route("/delete-video/:videoId").delete(verifyJWT, deleteVideo);

export default router;
