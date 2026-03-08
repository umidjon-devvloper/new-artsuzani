import mongoose, { Schema } from "mongoose";

const UserSchema = new Schema(
  {
    clerkId: { type: String, unique: true, index: true, required: true },
    email: { type: String },
    fullName: { type: String },
    picture: { type: String },
    role: { type: String, default: "user" },
    isAdmin: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// collision bo'lsa qaytadan compilesiz
export default mongoose.models.User || mongoose.model("User", UserSchema);
