import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { getVideos, uploadVideos } from "../controllers/video.controller.js";
import router from "./user.routes.js";

const router = Router();
router.route("/get-videos").get(getVideos);

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

export default router;
