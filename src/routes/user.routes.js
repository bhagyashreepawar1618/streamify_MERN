import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  loginUser,
  logoutUser,
  registerUser,
  refreshAccessToken,
  changeCurrentPassword,
  updateAccountDetails,
  updateAvtar,
  updateCoverImage,
  getUserChannelProfile,
  getUserWatchedHistory,
  uploadVideos,
} from "../controllers/user.controller.js";

const router = Router();

import { upload } from "../middlewares/multer.middleware.js";

//middleware code here
//register route
router.route("/register").post(
  //middleware of multer
  //used array because we have uploaded 2 filelds
  upload.fields([
    {
      name: "avtar",
      maxCount: 1,
    },
    {
      name: "coverImage",
      maxCount: 1,
    },
  ]),
  registerUser
);

//login user
router.route("/login").post(loginUser);

//secured routes
router.route("/logout").post(verifyJWT, logoutUser);

//refresh access token
router.route("/refreshToken").post(refreshAccessToken);

//change password
router.route("/change-password").post(verifyJWT, changeCurrentPassword);

//update account details
router.route("/update-account").patch(verifyJWT, updateAccountDetails);

//update avtar
router
  .route("/avtar-update")
  .patch(verifyJWT, upload.single("avtar"), updateAvtar);

//update coverimage
router
  .route("/coverImage-update")
  .patch(verifyJWT, upload.single("coverImage"), updateCoverImage);

//getchannel profile
router.route("/c/:username").get(verifyJWT, getUserChannelProfile);

//watch history
router.route("/history").get(verifyJWT, getUserWatchedHistory);

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
