import mongoose, { Schema, model, models } from "mongoose";

const UserSchema = new Schema(
    {
        name: {
            type: String,
            required: [true, "Name is required"],
        },
        email: {
            type: String,
            unique: true,
            required: [true, "Email is required"],
        },
        password: {
            type: String,
            required: [true, "Password is required"],
            select: false,
        },
        role: {
            type: String,
            enum: ["user", "admin", "volunteer"],
            default: "user",
        }
    },
    { timestamps: true }
);

const User = models.User || model("User", UserSchema);

export default User;
