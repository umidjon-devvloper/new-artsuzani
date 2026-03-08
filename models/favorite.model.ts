import mongoose, { Schema, models, model } from "mongoose";

const FavoriteSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    productId: { type: Schema.Types.ObjectId, ref: "Product" }, // вќ— ref aynan "Product"
  },
  { timestamps: true }
);

FavoriteSchema.index({ userId: 1, productId: 1 }, { unique: true });

export default models.Favorite || model("Favorite", FavoriteSchema);
