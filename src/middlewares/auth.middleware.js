import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiErrors.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

export const verifyJWT = asyncHandler(async (req, _, next) => {
  //access token from cookies
  //we've set cookies at the time of login

  console.log("origin=", process.env.PORT);
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    //if token is not there throw an error

    console.log("token is=", token);

    if (!token) {
      throw new ApiError(401, "Unauthorized request");
    }
    console.log("token is =", token);
    //if token is present
    //verify compare accesstoken secret present in cookie and in our server
    //and returns info that we've set at the time of token creation
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    console.log("decoded token=", decodedToken);

    //now we have the data (_id) so we can get the instance
    const user = await User.findById(decodedToken?._id).select(
      " -password -refreshToken"
    );

    //if user not found
    if (!user) {
      throw new ApiError(401, "Invalid Access Token");
    }

    //  if user is present
    req.user = user;
    next();
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid AccessToken");
  }
});
