import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function CheckoutSuccessPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-20 min-h-[70vh] flex flex-col items-center justify-center text-center mt-10">
      <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mb-8 border border-green-100 shadow-sm">
        <svg
          className="w-12 h-12 text-green-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
        </svg>
      </div>
      
      <h1 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-4">
        Thank You For Your Order!
      </h1>
      
      <p className="text-lg text-muted-foreground max-w-xl mx-auto mb-10 leading-relaxed">
        Your order has been successfully placed and is now being processed. We will send you an email confirmation shortly with your shipping details.
      </p>

      <div className="p-6 bg-white border border-border rounded-xl shadow-soft w-full md:w-3/4 mb-10">
        <h3 className="text-xl font-serif font-bold text-foreground mb-2">
          What happens next?
        </h3>
        <p className="text-sm text-muted-foreground text-left leading-relaxed">
          Our artisans will carefully prepare your handmade Artsuzani items piece by piece. Once shipped, you&apos;ll receive a tracking number to monitor your delivery. Expect a touch of true Bukhara heritage arriving at your doorstep very soon!
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <Link href="/products">
          <Button size="lg" className="rounded-full px-8 bg-gradient-primary text-white shadow-elegant hover:opacity-90 font-medium text-base h-14 w-full sm:w-auto border-none">
            Continue Shopping
          </Button>
        </Link>
        <Link href="/">
          <Button variant="outline" size="lg" className="rounded-full px-8 bg-white border-border text-foreground hover:bg-gray-50 focus:ring-ring font-medium text-base h-14 w-full sm:w-auto shadow-sm">
            Return to Homepage
          </Button>
        </Link>
      </div>
    </div>
  );
}
