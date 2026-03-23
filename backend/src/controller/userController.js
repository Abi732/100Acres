// backend/src/controller/userController.js

import { User } from "../model/user.Schema.js";
import { clerkClient } from "@clerk/express";

// ── POST /api/users/onboard ───────────────────────────────────────────────────
export const onboardUser = async (req, res) => {
  try {
    const clerkId = req.auth.userId;
    const { role } = req.body;

    const clerkUser = await clerkClient.users.getUser(clerkId);
    const email = clerkUser.emailAddresses[0].emailAddress;
    const name  = `${clerkUser.firstName || ""} ${clerkUser.lastName || ""}`.trim();
    const image = clerkUser.imageUrl;

    if (role === "admin" && email !== process.env.ADMIN_EMAIL) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to register as admin",
      });
    }

    // Already onboarded — just return existing user (don't re-create)
    const existingUser = await User.findOne({ clerkId });
    if (existingUser) {
      return res.json({
        success: true,
        message: "User already onboarded",
        user: existingUser,
      });
    }

    const newUser = await User.create({ clerkId, name, email, role, image });

    res.status(201).json({
      success: true,
      message: "User onboarded successfully",
      user: newUser,
    });
  } catch (error) {
    console.error("onboardUser error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ── GET /api/users/me ─────────────────────────────────────────────────────────
export const getMe = async (req, res) => {
  try {
    const clerkId = req.auth.userId;

    const user = await User.findOne({ clerkId });

    if (!user) {
      // ✅ 404 + needsOnboarding:true — frontend uses this to show onboarding
      return res.status(404).json({
        success: false,
        message: "User not found",
        needsOnboarding: true,
      });
    }

    // ✅ Return user with role
    res.json({ success: true, user });

  } catch (error) {
    console.error("getMe error:", error);
    // ✅ 500 — do NOT set needsOnboarding, this is a server error
    res.status(500).json({ success: false, message: "Server error" });
  }
};