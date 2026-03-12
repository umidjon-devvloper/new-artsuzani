import { getAllOrders } from "@/actions/orders.actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import OrderStatus from "../_components/order-status"; // <— YANGI
import { date } from "zod";

export default async function OrdersPage() {
  const orders = await getAllOrders();
  console.log("OrdersPage orders:", orders);
  const createdAt = (date: any) => {
    return new Date(date).toLocaleDateString("uz-Uz", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Orders</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {orders.map((order: any) => (
          <Card key={order._id} className="shadow-md rounded-2xl">
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>{order.fullName}</span>
                {/* Badge + Select (client) */}
                <OrderStatus
                  orderId={String(order._id)}
                  initialStatus={order.status}
                />
              </CardTitle>
              <span>
                Order ID: {(order?._id?.toString?.() ?? "").slice(-6)}
              </span>
            </CardHeader>

            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Location</p>
                <p>{order.location}</p>
              </div>

              <Separator />

              {/* ITEMS jadvali — siz keltirgancha qoldirdim */}
              <div>
                <p className="text-sm text-muted-foreground mb-2">Items</p>
                <ScrollArea className="rounded-lg border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[64px]">Image</TableHead>
                        <TableHead>Product</TableHead>
                        <TableHead className="text-right">Price</TableHead>
                        <TableHead className="text-center">Qty</TableHead>
                        <TableHead className="text-right">Subtotal</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {order.items?.map((item: any, i: number) => {
                        const p = item.productId ?? {};
                        const title = p.title ?? item.name ?? "Product";
                        const price = Number(p.price ?? item.price ?? 0);
                        const qty = Number(item.quantity ?? 1);
                        const subtotal = price * qty;
                        const imgSrc =
                          Array.isArray(p.images) && p.images.length > 0
                            ? p.images[0]
                            : "/placeholder.png";
                        const desc =
                          (p.description as string)
                            ?.replace(/\s+/g, " ")
                            .trim() ?? "";

                        return (
                          <TableRow key={item._id ?? i}>
                            <TableCell>
                              <div className="relative h-12 w-12 overflow-hidden rounded-md border">
                                <Image
                                  src={imgSrc}
                                  alt={title}
                                  fill
                                  sizes="48px"
                                  className="object-cover"
                                  priority={i < 2}
                                />
                              </div>
                            </TableCell>
                            <TableCell className="align-top">
                              <div className="font-medium line-clamp-1">
                                {title}
                              </div>
                              {desc && (
                                <p className="text-xs text-muted-foreground line-clamp-2">
                                  {desc}
                                </p>
                              )}
                            </TableCell>
                            <TableCell className="text-right align-top">
                              {price.toLocaleString(undefined, {
                                style: "currency",
                                currency: "USD",
                                maximumFractionDigits: 2,
                              })}
                            </TableCell>
                            <TableCell className="text-center align-top">
                              {qty}
                            </TableCell>
                            <TableCell className="text-right align-top font-medium">
                              {subtotal.toLocaleString(undefined, {
                                style: "currency",
                                currency: "USD",
                                maximumFractionDigits: 2,
                              })}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </ScrollArea>

                <Separator className="my-3" />
                <div className="flex items-center justify-end gap-6">
                  <div className="text-sm text-muted-foreground">Total:</div>
                  <div className="text-base font-semibold">
                    {(() => {
                      const total =
                        order.items?.reduce((acc: number, item: any) => {
                          const price = Number(
                            item.productId?.price ?? item.price ?? 0
                          );
                          const qty = Number(item.quantity ?? 1);
                          return acc + price * qty;
                        }, 0) ?? 0;

                      return total.toLocaleString(undefined, {
                        style: "currency",
                        currency: "USD",
                        maximumFractionDigits: 2,
                      });
                    })()}
                  </div>
                </div>
              </div>
              {/* pastdagi eski Select bo'limi olib tashlandi */}
            </CardContent>
            <div className="flex justify-end pr-3">
              {createdAt(order.createdAt)}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
