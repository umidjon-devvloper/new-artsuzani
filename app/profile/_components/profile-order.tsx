"use client";
import { UserProfile } from "@clerk/nextjs";
import Link from "next/link";
import React, { useState } from "react";

type Product = {
  _id: string;
  title: string;
  description?: string;
  category?: string;
  price: number; // Masalan: 79.99
  images?: string[]; // [url, ...]
  createdAt?: string;
  updatedAt?: string;
};

type OrderItem = {
  _id: string;
  productId: Product; // .populate("items.productId") qilingan
  quantity: number; // Eslatma: sizda "qty" emas, "quantity"
};

type Order = {
  _id: string;
  userId: string;
  fullName: string;
  location: string;
  status: "pending" | "completed" | "cancelled" | string;
  createdAt: string;
  updatedAt?: string;
  items: OrderItem[];
};

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD", // Agar so"m bo"lsa "UZS" ga almashtiring
  maximumFractionDigits: 2,
});

const ProfileOrder = ({ orders }: { orders: Order[] }) => {
  const [activeTab, setActiveTab] = useState<"orders" | "profile">("orders");

  return (
    <div>
      <div className="text-center mt-16">
        <h1 className="text-2xl mb-6">Profile Page</h1>
        <div className="flex justify-center gap-4">
          <button
            onClick={() => setActiveTab("orders")}
            className={`px-4 py-2 rounded-lg ${
              activeTab === "orders"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-black"
            }`}
          >
            Orders
          </button>
          <button
            onClick={() => setActiveTab("profile")}
            className={`px-4 py-2 rounded-lg ${
              activeTab === "profile"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-black"
            }`}
          >
            User
          </button>
        </div>
      </div>

      <div className="mt-10 flex justify-center w-full">
        {activeTab === "orders" && (
          <div className="max-w-3xl w-full space-y-6">
            <h2 className="text-xl font-semibold mb-4 text-center">
              Order list
            </h2>
            <h2 className="text-xl font-semibold mb-4 text-center">
              To complete your payment, please contact us via WhatsApp.
            </h2>
            <h2 className="text-xl font-semibold mb-4 text-center">
              Please include your Order ID when you contact us.
            </h2>

            {orders?.length ? (
              orders.map((order) => {
                const orderTotal = order.items.reduce((sum, it) => {
                  const unit = it.productId?.price ?? 0;
                  return sum + unit * (it.quantity ?? 0);
                }, 0);

                return (
                  <div
                    key={order._id}
                    className="border rounded-xl p-4 shadow-sm"
                  >
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">
                          Order ID: {order._id.slice(-6)}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded text-xs sm:text-sm ${
                            order.status === "pending"
                              ? "bg-yellow-100 text-yellow-700"
                              : order.status === "completed"
                              ? "bg-green-100 text-green-700"
                              : order.status === "cancelled"
                              ? "bg-red-100 text-red-700"
                              : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {order.status}
                        </span>
                      </div>
                      <span className="text-sm text-gray-500">
                        {new Date(order.createdAt).toLocaleString()}
                      </span>
                    </div>

                    {/* Meta */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-sm mb-4">
                      <p>
                        <span className="font-semibold">Name:</span>{" "}
                        {order.fullName}
                      </p>
                      <p className="sm:col-span-2">
                        <span className="font-semibold">Location:</span>{" "}
                        {order.location}
                      </p>
                    </div>

                    {/* Items */}
                    <div className="space-y-3">
                      {order.items.map((item) => {
                        const img =
                          item.productId?.images?.[0] ??
                          "https://placehold.co/80x80/png?text=No+Image";
                        const title = item.productId?.title ?? "Product";
                        const unitPrice = item.productId?.price ?? 0;
                        const qty = item.quantity ?? 0;
                        const lineTotal = unitPrice * qty;

                        return (
                          <div
                            key={item._id}
                            className="flex items-center gap-3 border rounded-lg p-3"
                          >
                            <img
                              src={img}
                              alt={title}
                              className="w-16 h-16 object-cover rounded-md"
                            />
                            <div className="flex-1 min-w-0">
                              <p className="font-medium truncate">{title}</p>
                              <div className="text-sm text-gray-600 flex flex-wrap gap-3 mt-1">
                                <span>
                                  Qty:{" "}
                                  <span className="font-medium">{qty}</span>
                                </span>
                                <span>
                                  Price:{" "}
                                  <span className="font-medium">
                                    {currency.format(unitPrice)}
                                  </span>
                                </span>
                                <span>
                                  Subtotal:{" "}
                                  <span className="font-semibold">
                                    {currency.format(lineTotal)}
                                  </span>
                                </span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Footer total */}
                    <div className="flex items-center gap-18 justify-end mt-4">
                      <div className="text-right">
                        <p className="text-sm text-gray-500">Order total</p>
                        <p className="text-lg font-semibold">
                          {currency.format(orderTotal)}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <h1>To make a payment</h1>
                        <Link
                          href={
                            "https://api.whatsapp.com/send/?phone=998917767714&text&type=phone_number&app_absent=0"
                          }
                          target="_blank"
                        >
                          <img
                            className="cursor-pointer w-10 h-10"
                            src="/whatsapp.png"
                            alt="Payme"
                          />
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-gray-600 text-center">
                There are no orders yet..
              </p>
            )}
          </div>
        )}

        {activeTab === "profile" && (
          <div className="max-w-3xl w-full">
            <h2 className="text-xl font-semibold mb-6 text-center">
              User information
            </h2>
            <UserProfile />
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileOrder;
