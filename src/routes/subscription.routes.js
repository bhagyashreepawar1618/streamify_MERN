import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { setSubscriptionDetails } from "../controllers/subscriptions.controller.js";
const router = Router();

router
  .route("/set-subscription-details")
  .post(verifyJWT, setSubscriptionDetails);

export default router;
