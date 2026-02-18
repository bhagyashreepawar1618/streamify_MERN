import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  getVideos,
  uploadVideos,
  getUserVideos,
} from "../controllers/video.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();
//get all videos
router.route("/get-videos").get(getVideos);

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

router.route("/delete-video/:videoId").get(verifyJWT, deleteVideo);

export default router;
