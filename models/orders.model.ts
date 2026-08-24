import { Schema, model, models } from "mongoose";

const OrderItemSchema = new Schema(
  {
    productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    quantity: { type: Number, default: 1 },
  },
  { _id: true }
);

const OrderSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    guestId: String,
    items: [OrderItemSchema],
    fullName: String,
    location: String,
    status: {
      type: String,
      enum: ["pending", "completed", "canceled"],
      default: "pending",
    },
  },
  { timestamps: true }
);

// Foydalanuvchi/mehmon buyurtmalarini olish uchun (collscan'ni oldini oladi)
OrderSchema.index({ userId: 1, createdAt: -1 });
OrderSchema.index({ guestId: 1, createdAt: -1 });
// Admin paneldagi status bo'yicha filtr/sanash uchun
OrderSchema.index({ status: 1, createdAt: -1 });

export const OrdersModel = models.Order || model("Order", OrderSchema);
