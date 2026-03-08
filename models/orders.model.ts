import { Schema, model, models } from "mongoose";

const OrderItemSchema = new Schema(
  {
    productId: { type: Schema.Types.ObjectId, ref: "Product", required: true }, // <-- "Product" nomi mos
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

export const OrdersModel = models.Order || model("Order", OrderSchema);
