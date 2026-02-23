import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiErrors.js";
import { User } from "../models/user.model.js";
import uploadOnCloudinary from "../utils/cloudinary.js";
import ApiResponse from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

//generate access and refreshTokens
const generateAccessAndRefreshTokens = async (userId) => {
  try {
    //user Instance
    const user = await User.findById(userId);
    //we've got all the properties in user (user is an object)

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    user.accessToken = accessToken;

    //directly save in database without validation
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong While generating Refresh and Access Token"
    );
  }
};
//register user
const registerUser = asyncHandler(async (req, res) => {
  //get details from user (frontend)
  //validation if email is correct -not empty fields
  //check if user already exists
  //check for images, check for avtar
  //upload them to cloudinary
  //create user object -crate entry in db
  //remove password and refreshtoken feild from response
  //check for user creation
  //return response

  const { fullname, email, username, password } = req.body;

  //validation
  if (fullname === "" || username === "" || password === "" || email === "") {
    throw new ApiError(400, "All feilds are compulsory");
  }

  //if user is already registered
  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  //throw an error
  if (existedUser) {
    throw new ApiError(409, "User with email or username Already Exists...");
  }

  //console.log (req.files)
  const avtarLocalPath = req.files?.avtar?.[0]?.path;
  const coverImageLocalPath = req.files?.coverImage?.[0]?.path;

  if (!avtarLocalPath) {
    throw new ApiError(400, "Avtar file is required");
  }

  //after getting the local path uload them on cloudinary
  //use await because it is an time taking process
  const avtar = await uploadOnCloudinary(avtarLocalPath);

  let coverImage = "";
  if (coverImageLocalPath) {
    coverImage = await uploadOnCloudinary(coverImageLocalPath);
  }

  if (!avtar) {
    throw new ApiError(400, "Avtar file is required");
  }

  //use .create method to store all in database
  //for this particular user all feilds are stores in user database

  const user = await User.create({
    fullname,
    avtar: avtar?.url,
    //we haven't verifeid if user has upload the coverImage or not
    //therefore check or condition
    coverImage: coverImage?.url || "",
    email,
    password,
    username: username.toLowerCase(),
  });
  //user is entry User is Schema
  //checks if user is created in database using _id
  //if it exists then remove password and -refreshToken
  //.select removes entered fields
  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  //if created user doesnot exists
  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering user");
  }

  return res
    .status(201)
    .json(new ApiResponse(201, createdUser, "User registered successfully..."));
});

//login user
const loginUser = asyncHandler(async (req, res) => {
  //take username and password from req.body
  //check if username is present or not
  //find the user in database
  //if user find
  //check password
  //access and refresh token
  //send cookie
  const { username, password } = req.body;

  //atleast one is required
  if (!username) {
    throw new ApiError(400, "username is required");
  }

  //instance will be return
  //user contain all the information from database
  const user = await User.findOne({ username });

  //if not found
  if (!user) {
    throw new ApiError(400, "User is not registered..!!");
  }

  const isPassValid = await user.isPasswordCorrect(password);

  //if password is not true
  if (!isPassValid) {
    throw new ApiError(401, "Invalid user Credentials");
  }

  //if password is correct generate refresh and accesstokens
  //from user Instance we can get access of _id attribute
  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    user._id
  );

  //send cookie
  //remove password and refresh token then send the response (send accessToken and other info)
  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken "
  );

  //cookie is not modifiable by browser
  //it can be only modified in server
  const options = {
    httpOnly: true,
    secure: true, //for local host it should be false
    sameSite: "none",
  };

  //response

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          accessToken,
          refreshToken,
        },
        "User logged in successfully"
      )
    );
});

//logout
const logoutUser = asyncHandler(async (req, res) => {
  //cookies clear
  //and generate refreshToken again
  //we've access of req.user (which contain information)

  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        refreshToken: null,
      },
    },
    {
      new: true,
    }
  );

  const options = {
    httpOnly: true,
    secure: true,
    sameSite: "none",
  };

  //response
  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User Logged out successfully"));
});
// refresh access token
const refreshAccessToken = asyncHandler(async (req, res) => {
  //access refreshtoken from cookies
  const incomingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken;

  if (!incomingRefreshToken) {
    throw new ApiError(401, "unauthorised Request");
  }

  try {
    //decode the encrypted token
    const decodedToken = await jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    //access of user Instance
    const user = await User.findById(decodedToken?._id);

    if (!user) {
      throw new ApiError(401, "Invalid RefreshToken");
    }

    //compare refreshToken stored in database and incoming refreshToken
    if (incomingRefreshToken !== user?.refreshToken) {
      throw new ApiError(404, "RefreshToken is expired or used !");
    }

    const options = {
      httpOnly: true,
      secure: true,
    };

    const { accessToken, newRefreshToken } =
      await generateAccessAndRefreshTokens(user._id);

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshtoken", newRefreshToken, options)
      .json(
        new ApiResponse(
          200,
          {
            accessToken,
            newRefreshToken,
          },
          "Access token refreshed succeesfully"
        )
      );
  } catch (error) {
    console.log("Error ocured ", error);
    throw new ApiError(401, error?.message || "Invalid refresh Token");
  }
});

//ChaneCurrentPassword
const changeCurrentPassword = asyncHandler(async (req, res) => {
  //take data from frontend
  const { oldPassword, newPassword, confirmPassword } = req.body;

  if (newPassword !== confirmPassword) {
    throw new ApiError(
      404,
      "new password and confirm password did not matched..!!"
    );
  }
  //we've access to req.user using authmiddleware (verify jwt)
  const user = await User.findById(req.user?._id);
  const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);

  //if password is not correct
  if (!isPasswordCorrect) {
    throw new ApiError(400, "Invalid Password");
  }

  //password is corect set newpassword
  user.password = newPassword;

  //save user
  await user.save({ validateBeforeSave: false });

  //send response
  return res
    .status(200)
    .json(new ApiResponse(200, "password updated successfully..!!"));
});

//update other details
const updateAccountDetails = asyncHandler(async (req, res) => {
  const { fullname, email, username } = req.body;

  if (!fullname || !email || !username) {
    throw new ApiError(400, "All Feilds are required ..!!");
  }

  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        fullname,
        email,
        username,
      },
    },
    {
      new: true,
    }
  ).select("-password");

  return res
    .status(200)
    .json(new ApiResponse(200, user, "Account details updated successfully"));
});

//update files
const updateAvtar = asyncHandler(async (req, res) => {
  //take new file from user
  console.log("req.file=", req.file);
  const avtarLocalPath = req.file?.path;
  console.log("avtar=", avtarLocalPath);

  if (!avtarLocalPath) {
    throw new ApiError(400, "Avtar file is missing");
  }

  //upload on cloudinary
  const avtar = await uploadOnCloudinary(avtarLocalPath);

  if (!avtar?.url) {
    throw new ApiError(400, "Error while uploading avtar on cloudinary");
  }

  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        avtar: avtar.url,
      },
    },
    {
      new: true,
    }
  ).select("-password");

  return res
    .status(200)
    .json(new ApiResponse(200, user, "avtar updated succesfully"));
});

const updateCoverImage = asyncHandler(async (req, res) => {
  //take new file from user
  const coverImageLocalPath = req.file?.path;

  if (!coverImageLocalPath) {
    throw new ApiError(400, "coverImage file is missing");
  }

  //upload on cloudinary
  const coverImage = await uploadOnCloudinary(coverImageLocalPath);

  if (!coverImage?.url) {
    throw new ApiError(400, "Error while uploading coverImage on cloudinary");
  }

  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        coverImage: coverImage.url,
      },
    },
    {
      new: true,
    }
  ).select("-password");

  return res
    .status(200)
    .json(new ApiResponse(200, user, " CoverImage uploaded successfully"));
});

//get user information for profile
const getUserChannelProfile = asyncHandler(async (req, res) => {
  const { username } = req.params;
  //if username is not present
  if (!username?.trim()) {
    throw new ApiError(400, "Username is missing");
  }

  //find user in database
  const channel = await User.aggregate([
    {
      $match: {
        username: username?.toLowerCase(),
      },
    },
    {
      $lookup: {
        from: "subscriptions",
        localField: "_id",
        foreignField: "channel",
        as: "subscribers",
      },
    },
    {
      $lookup: {
        from: "subscriptions",
        localField: "_id",
        foreignField: "subscriber",
        as: "subscribeTo",
      },
    },
    {
      $addFields: {
        subscribersCount: {
          $size: "$subscribers",
        },
        channelsSubscribedToCount: {
          $size: "$subscribeTo",
        },
      },
    },
    {
      $project: {
        fullname: 1,
        username: 1,
        subscribersCount: 1,
        channelsSubscribedToCount: 1,
        email: 1,
        avtar: 1,
        coverImage: 1,
        _id: 1,
      },
    },
  ]);

  if (!channel?.length) {
    throw new ApiError(404, "Channel does not exist");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, channel[0], "User channel fetched successfully..!!")
    );
});

//get another user channel profile

const getAnotherUserChannelProfile = asyncHandler(async (req, res) => {
  const { username } = req.params;

  //if username is not present
  if (!username?.trim()) {
    throw new ApiError(400, "Username is missing");
  }

  //find user in database
  const channel = await User.aggregate([
    {
      $match: {
        username: username?.toLowerCase(),
      },
    },
    {
      $lookup: {
        from: "subscriptions",
        localField: "_id",
        foreignField: "channel",
        as: "subscribers",
      },
    },
    {
      $lookup: {
        from: "subscriptions",
        localField: "_id",
        foreignField: "subscriber",
        as: "subscribeTo",
      },
    },
    {
      $addFields: {
        subscribersCount: {
          $size: "$subscribers",
        },
        channelsSubscribedToCount: {
          $size: "$subscribeTo",
        },
        isSubscribed: {
          $cond: {
            if: {
              $in: [
                new mongoose.Types.ObjectId(req.user?._id),
                "$subscribers.subscriber",
              ],
            },
            then: true,
            else: false,
          },
        },
      },
    },
    {
      $project: {
        fullname: 1,
        username: 1,
        subscribersCount: 1,
        channelsSubscribedToCount: 1,
        email: 1,
        avtar: 1,
        coverImage: 1,
        _id: 1,
        isSubscribed: 1,
      },
    },
  ]);

  if (!channel?.length) {
    throw new ApiError(404, "Channel does not exist");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, channel[0], "User channel fetched successfully..!!")
    );
});

//sey watch history
const addToWatchHistory = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  await User.findByIdAndUpdate(
    req.user._id,
    {
      $addToSet: { watchHistory: videoId }, // duplicate avoid
    },
    { new: true }
  );

  return res.status(200).json({
    message: "Added to watch history",
  });
});
//get user watch history
const getUserWatchedHistory = asyncHandler(async (req, res) => {
  //we got a string here (req.user._id)
  const user = await User.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(req.user._id),
      },
    },
    {
      $lookup: {
        from: "videos",
        localField: "watchHistory",
        foreignField: "_id",
        as: "watchedHistory",
        pipeline: [
          {
            $lookup: {
              from: "users",
              localField: "owner",
              foreignField: "_id",
              as: "owner",
              pipeline: [
                {
                  $project: {
                    fullname: 1,
                    username: 1,
                    avtar: 1,
                  },
                },
              ],
            },
          },
          {
            $addFields: {
              owner: {
                $first: "$owner",
              },
            },
          },
        ],
      },
    },
  ]);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        user[0].watchedHistory,
        "watch History Fetched SuccessFully"
      )
    );
});

export {
  registerUser,
  loginUser,
  logoutUser,
  updateAvtar,
  updateAccountDetails,
  updateCoverImage,
  refreshAccessToken,
  changeCurrentPassword,
  getUserChannelProfile,
  getUserWatchedHistory,
  getAnotherUserChannelProfile,
  addToWatchHistory,
};
