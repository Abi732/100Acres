import {User} from "../model/user.Schema.js";
import { clerkClient } from "@clerk/express";
import { Webhook } from "svix";

 export const onboardUser = async (req, res) => {
  try {

    const clerkId = req.auth.userId;

    const { role } = req.body;

    // get user from clerk
    const clerkUser = await clerkClient.users.getUser(clerkId);

    const email = clerkUser.emailAddresses[0].emailAddress;
    const name = `${clerkUser.firstName || ""} ${clerkUser.lastName || ""}`.trim();
    const image = clerkUser.imageUrl;

    const ADMIN_EMAIL = process.env.ADMIN_EMAIL;

    // check if user is trying to assign admin role
    if (role === "admin" && email !== ADMIN_EMAIL) {
      console.log("Unauthorized admin registration attempt");
      return res.status(403).json({
        success: false,
        message: "You are not allowed to register as admin"
      });
    }

    // check if user already exists
    const existingUser = await User.findOne({ clerkId });

    if (existingUser) {
      console.log("User already onboarded");
      return res.json({
        success: true,
        message: "User already onboarded"
      });
    }

    // create user
    const newUser = await User.create({
      clerkId,
      name,
      email,
      role,
      image
    });
    console.log("User onboarded successfully");

    res.status(201).json({
      success: true,
      message: "User onboarded successfully",
      user: newUser
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server error"
    });

  }
};

