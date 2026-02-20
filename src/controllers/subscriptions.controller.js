import asyncHandler from "../utils/asyncHandler.js";
import Subscription from "../models/subsciptions.model.js";
import ApiResponse from "../utils/ApiResponse.js";
//set subscription details
const setSubscriptionDetails = asyncHandler(async (req, res) => {
  //take data from user
  const { channelId } = req.body;

  //if user already exists

  const existedUser = Subscription.findOne({
    channel: channelId,
    subscriber: req.user._id,
  });

  //unsubscribe
  if (existedUser) {
    await existedUser.deleteOne();
  } else {
    await Subscription.create({
      channel: channelId,
      subscriber: req.user._id,
    });
  }

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Subscription details saved successfully"));
});

export { setSubscriptionDetails };
