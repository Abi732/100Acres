import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { clerkMiddleware, clerkClient, requireAuth, getAuth } from '@clerk/express'
import mongoose from "mongoose";
import userRoute from "./router/userRoute.js";
import {User} from "./model/user.Schema.js";
import { Webhook } from "svix";
// import propertyRoute from "./router/propertyRoute.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT ;

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected Successfully"))
  .catch((err) => console.log("MongoDB Connection Error:", err));


app.post(
  "/api/webhooks/clerk",
  express.raw({ type: "application/json" }),
   async (req, res) => {
  try {
    console.log("Received Clerk webhook");
    const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

    const evt = wh.verify(
      req.body,
      {
        "svix-id": req.headers["svix-id"],
        "svix-timestamp": req.headers["svix-timestamp"],
        "svix-signature": req.headers["svix-signature"]
      }
    );

    const { type, data } = evt;

    if (type === "user.deleted") {

      const clerkId = data.id;

      await User.findOneAndDelete({ clerkId });

      console.log("User deleted from database");

    }

    res.status(200).json({ success: true });

  } catch (error) {

    console.error("Webhook error:", error);

    res.status(400).json({ error: "Webhook verification failed" });

  }
}
);
// Middleware
app.use(express.json());
app.use(clerkMiddleware())
app.use(cors(
    {
        origin: process.env.FRONTEND_URL ,
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE"],
    }
));

// Routes
app.get("/", (req, res) => {
    res.send("Hello from the backend!");
});
app.use("/api/users", userRoute);

app.get('/protected', requireAuth(), async (req, res) => {
  // Use `getAuth()` to get the user's `userId`
  const { userId } = getAuth(req)

  // Use Clerk's JS Backend SDK to get the user's User object
  const user = await clerkClient.users.getUser(userId)
  console.log(user);

  return res.json({ user })
})

// app.use("/api/properties", propertyRoute);

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});