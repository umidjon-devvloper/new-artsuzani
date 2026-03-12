"use client";

import * as React from "react";
import {
  ChartBarStacked,
  Command,
  File,
  FolderKanban,
  Rss,
  SendToBack,
} from "lucide-react";
import { NavUser } from "../_components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useRouter } from "next/navigation";

// This is sample data
const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/admin",
      icon: File,
      isActive: false,
    },
    {
      title: "Products",
      url: "/admin/products",
      icon: FolderKanban,
      isActive: false,
    },
    {
      title: "Categories",
      url: "/admin/categories",
      icon: ChartBarStacked,
      isActive: false,
    },
    {
      title: "Blogs",
      url: "/admin/blogs",
      icon: Rss,
      isActive: false,
    },
    {
      title: "Orders",
      url: "/admin/orders",
      icon: SendToBack,
      isActive: false,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [activeItem, setActiveItem] = React.useState(data.navMain[0]);
  const { setOpen } = useSidebar();
  const route = useRouter();
  return (
    <Sidebar collapsible="icon" className="overflow-hidden " {...props}>
      <Sidebar collapsible="none" className=" border-r">
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg" asChild className="md:h-8 md:p-0">
                <a href="#">
                  <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                    <Command className="size-4" />
                  </div>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-medium">Admin panel</span>
                    <span className="truncate text-xs">Sahifalar</span>
                  </div>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent className="px-1.5 md:px-0">
              <SidebarMenu>
                {data.navMain.map((item) => (
                  <SidebarMenuItem
                    key={item.title}
                    onClick={() => {
                      setActiveItem(item);
                      route.push(item.url);
                    }}
                  >
                    <SidebarMenuButton
                      tooltip={{
                        children: item.title,
                        hidden: false,
                      }}
                      isActive={activeItem?.title === item.title}
                      className="px-2.5 md:px-2 cursor-pointer"
                    >
                      <item.icon />
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <NavUser />
        </SidebarFooter>
      </Sidebar>
    </Sidebar>
  );
}
