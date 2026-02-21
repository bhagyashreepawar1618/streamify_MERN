import asyncHandler from "../utils/asyncHandler.js";
import { Subscription } from "../models/subsciptions.model.js";
import ApiResponse from "../utils/ApiResponse.js";
//set subscription details
const setSubscriptionDetails = asyncHandler(async (req, res) => {
  //take data from user
  const { channelId } = req.body;
  console.log("channel id is=", channelId);

  //if user already exists

  const existedUser = await Subscription.findOne({
    channel: channelId,
    subscriber: req.user._id,
  });

  console.log("existed user=", existedUser);
  //unsubscribe
  if (existedUser) {
    await Subscription.findByIdAndDelete(existedUser._id);
    return res
      .status(200)
      .json(new ApiResponse(200, {}, "Unsubscribed successfully"));
  } else {
    const user = await Subscription.create({
      channel: channelId,
      subscriber: req.user._id,
    });
    console.log("user sub=", user);

    console.log("subscribed succesfully");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Subscription details saved successfully"));
});

export { setSubscriptionDetails };
