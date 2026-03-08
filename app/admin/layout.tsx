import React from "react";
import SidebarDashboard from "./_components/sidebar-dashboard";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Separator } from "@radix-ui/react-dropdown-menu";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { auth } from "@clerk/nextjs/server";
import { getRole } from "@/actions/user.actions";
import { redirect } from "next/navigation";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = await auth();
  const user = await getRole(userId!);
  if (!user?.isAdmin) return redirect("/");
  return (
    <SidebarProvider>
      <div className="flex h-screen w-screen overflow-hidden">
        <SidebarDashboard />
        <div className="w-full">
          <SidebarInset className="w-full border-b">
            <header className="bg-background sticky top-0 flex justify-between shrink-0 items-center gap-2 border-b p-4">
              <div className="flex items-center gap-2">
                <SidebarTrigger className="-ml-1" />
                <Separator className="mr-2 data-[orientation=vertical]:h-4" />
                <Breadcrumb>
                  <BreadcrumbList>
                    <BreadcrumbItem className="hidden md:block">
                      <BreadcrumbLink href="#">All Inboxes</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator className="hidden md:block" />
                    <BreadcrumbItem>
                      <BreadcrumbPage>Inbox</BreadcrumbPage>
                    </BreadcrumbItem>
                  </BreadcrumbList>
                </Breadcrumb>
              </div>
            </header>
          </SidebarInset>
          <div className="overflow-scroll h-full mb-20 bg-white  text-black">
            {children}
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}
