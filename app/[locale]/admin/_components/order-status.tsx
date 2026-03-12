"use client";

import { useState, useTransition } from "react";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { updateOrderStatus, type OrderStatus } from "@/actions/orders.actions";
// ixtiyoriy: import { toast } from "sonner";

function badgeVariant(s: OrderStatus) {
  return s === "pending"
    ? "secondary"
    : s === "completed"
    ? "default"
    : "outline";
}

export default function OrderStatus({
  orderId,
  initialStatus,
}: {
  orderId: string;
  initialStatus: OrderStatus;
}) {
  const [status, setStatus] = useState<OrderStatus>(initialStatus);
  const [isPending, startTransition] = useTransition();

  const onChange = (val: OrderStatus) => {
    const prev = status;
    setStatus(val); // optimistik
    startTransition(async () => {
      try {
        await updateOrderStatus(orderId, val);
        // toast?.success?.("Status yangilandi");
      } catch (e) {
        setStatus(prev);
        // toast?.error?.("Xatolik yuz berdi");
        console.error(e);
      }
    });
  };

  return (
    <div className="flex items-center gap-2">
      <Badge variant={badgeVariant(status)} className="capitalize">
        {status}
      </Badge>
      <Select value={status} onValueChange={onChange} disabled={isPending}>
        <SelectTrigger className="w-[140px]">
          <SelectValue placeholder="Select status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="pending">Pending</SelectItem>
          <SelectItem value="completed">Completed</SelectItem>
          <SelectItem value="canceled">Canceled</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
