import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
{
    clerkId: {
        type: String,
        required: true,
        unique: true
    },

    name: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true,
        unique: true
    },

    role: {
        type: String,
        enum: ["buyer", "seller", "agent", "admin"],
        default: "buyer"
    },

    image: {
        type: String
    },

    phone: {
        type: String
    },

    savedProperties: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Property"
        }
    ]

},
{ timestamps: true }
);

export const User = mongoose.model("User", userSchema);