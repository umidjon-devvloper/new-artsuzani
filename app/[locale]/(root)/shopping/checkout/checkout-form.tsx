"use client";

import { useTransition, useState } from "react";
import { useRouter } from "next/navigation";
import { createOrder } from "@/actions/orders.actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Product = {
  _id: string;
  title: string;
  price: number;
};

type CartItem = {
  _id: string;
  productId: Product;
  quantity: number;
};

export default function CheckoutForm({
  userId,
  guestId,
  items,
}: {
  userId: string;
  guestId: string;
  items: CartItem[];
}) {
  const [isPending, startTransition] = useTransition();
  const route = useRouter();
  
  const [fullName, setFullName] = useState("");
  const [location, setLocation] = useState("");
  const [formError, setFormError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !location.trim()) {
      setFormError("Please fill in both Full Name and Location details.");
      return;
    }
    
    startTransition(async () => {
      setFormError(null);
      try {
        const order = await createOrder(
          userId || null,
          items.map((it) => ({
            productId: it.productId._id,
            quantity: it.quantity,
          })),
          fullName.trim(),
          location.trim()
        );
        
        // Orders created successfully. Forwarding to success panel
        route.push("/orders");
      } catch (err) {
        console.error("Order creation failed.", err);
        setFormError("An error occurred while creating your order. Please try again.");
      }
    });
  };

  return (
    <div className="bg-white/50 backdrop-blur-md rounded-2xl shadow-sm border border-border p-6 md:p-8">
      <h2 className="text-xl font-serif font-bold text-foreground mb-6">
        Customer Details
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="fullName" className="text-muted-foreground font-medium">Full Name <span className="text-destructive">*</span></Label>
            <Input
              id="fullName"
              placeholder="e.g. John Doe"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="h-12 border-border/60 focus:ring-primary bg-white/80"
              disabled={isPending}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="location" className="text-muted-foreground font-medium">Complete Shipping Address <span className="text-destructive">*</span></Label>
            <Input
              id="location"
              placeholder="e.g. 123 Suzani St, Tashkent, Uzbekistan"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="h-12 border-border/60 focus:ring-primary bg-white/80"
              disabled={isPending}
            />
          </div>
        </div>

        {formError && (
          <div className="p-3 rounded-md bg-destructive/10 text-destructive text-sm font-medium">
            {formError}
          </div>
        )}

        <div className="pt-6 mt-6 border-t border-border">
          <Button 
            type="submit" 
            disabled={isPending} 
            size="lg" 
            className="w-full h-14 text-lg font-medium shadow-elegant-light hover:opacity-90 bg-gradient-primary border-none rounded-xl"
          >
            {isPending ? "Processing Order..." : "Place Order"}
          </Button>
          <p className="mt-4 text-center text-xs text-muted-foreground">
            By placing your order, you agree to our Terms of Service and Privacy Policy. Secure guest checkout powered by Artsuzani.
          </p>
        </div>
      </form>
    </div>
  );
}
