"use client";

import React from "react";
import Image from "next/image";
import { format } from "date-fns";

type OrderItem = {
  quantity: number;
  product: {
    _id: string;
    title: string;
    price: number;
    images?: string[];
  };
};

type Order = {
  _id: string;
  createdAt: string;
  status: string;
  total: number;
  fullName: string;
  items: OrderItem[];
};

export default function OrderListClient({ orders }: { orders: Order[] }) {
  const WHATSAPP_NUMBER = "998901234567"; // Replace with real number

  const buildWhatsappUrl = (order: Order) => {
    const text = `Hello Artsuzani! I would like to complete the payment for my order.

*Order Details:*
Name: ${order.fullName}
Order ID: #${order._id}
Status: ${order.status}
Total: $${order.total.toFixed(2)}

Please send me the payment instructions!`;

    const encodedText = encodeURIComponent(text);
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedText}`;
  };

  return (
    <div className="space-y-6">
      {orders.map((order) => (
        <div
          key={order._id}
          className="bg-white border border-border/60 rounded-2xl shadow-sm hover:shadow-elegant-light transition-shadow overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gray-50 border-b border-border/60 p-4 md:px-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex flex-col sm:flex-row sm:gap-8 gap-2 text-sm">
              <div>
                <span className="text-muted-foreground block mb-1">Order Placed</span>
                <span className="font-medium text-foreground">
                  {format(new Date(order.createdAt), "MMMM d, yyyy")}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground block mb-1">Total Amount</span>
                <span className="font-medium text-foreground">
                  ${order.total.toFixed(2)}
                </span>
              </div>
            </div>

            <div className="flex flex-col items-start sm:items-end text-sm">
              <span className="text-muted-foreground mb-1">Order # {order._id.substring(0, 8)}...</span>
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold capitalize tracking-wide ${
                  order.status === "pending"
                    ? "bg-amber-100 text-amber-700"
                    : order.status === "completed"
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {order.status}
              </span>
            </div>
          </div>

          {/* Items */}
          <div className="p-4 md:p-6 space-y-4">
            {order.items.map((item, idx) => {
              const p = item.product || {};
              const img = p.images?.[0];
              return (
                <div key={`${order._id}-${idx}`} className="flex gap-4 items-center">
                  <div className="w-20 h-20 relative bg-muted rounded-xl overflow-hidden shrink-0 border border-border">
                    {img ? (
                      <Image
                        src={img}
                        alt={p.title || "Product Image"}
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    ) : (
                      <span className="grid place-items-center h-full text-xs text-muted-foreground">-</span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-serif font-bold text-foreground truncate text-base">
                      {p.title || "Untitled Product"}
                    </h4>
                    <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                  </div>
                  <div className="text-right font-medium">
                    ${((p.price || 0) * item.quantity).toFixed(2)}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Footer Action */}
          <div className="bg-gray-50 border-t border-border/60 p-4 md:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground text-center sm:text-left">
              {order.status === "pending" 
                ? "Your order requires payment to begin processing." 
                : "Thank you for shopping with Artsuzani."}
            </p>
            {order.status === "pending" && (
              <a 
                href={buildWhatsappUrl(order)} 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20bd5a] text-white px-6 py-3 rounded-full font-medium transition-colors shadow-sm whitespace-nowrap"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  fill="currentColor"
                  viewBox="0 0 16 16"
                >
                  <path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592zm3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.004-.247-.007-.38-.007a.729.729 0 0 0-.529.247c-.182.198-.691.677-.691 1.654 0 .977.71 1.916.81 2.049.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232z"/>
                </svg>
                Contact to Pay
              </a>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
