// backend/src/router/userRoute.js

import express from "express";
import { onboardUser, getMe } from "../controller/userController.js";
import { requireAuth } from "@clerk/express";

const userRoute = express.Router();

// POST /api/users/onboard — called from /onboarding page after role selection
userRoute.post("/onboard", requireAuth(), onboardUser);

// GET /api/users/me — called by Navbar + dashboard layouts to get role
userRoute.get("/me", requireAuth(), getMe);

export default userRoute;