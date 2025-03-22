import { Home, Telescope, SquareUserRound, Plus } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/link";

// Menu items.
const items = [
  {
    title: "Home",
    url: "/",
    icon: <Home color="white" />,
  },
  {
    title: "Explore",
    url: "/statistics",
    icon: <Telescope color="white" />,
  },
  {
    title: "Profile",
    url: "/profile",
    icon: <SquareUserRound color="white" />,
  },
];

export function AppSidebar() {
  return (
    <Sidebar collapsible="icon">
      <SidebarContent className="bg-[#181832] text-white padd">
        <SidebarGroup>
          <SidebarGroupLabel className="text-white text-2xl">
            AstroGlossary
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <div className="h-20/100"></div>
            <SidebarMenu className="place-content-center">
              <SidebarMenuItem className="place-content-center">
                <div className="flex items-center justify-center">
                  <SidebarMenuButton
                    asChild
                    className="w-12 h-12 bg-pink-500 text-white rounded-lg flex items-center justify-center shadow-md hover:bg-pink-600 transition"
                  >
                    <Link href="/add">
                      <Plus color="white" />
                    </Link>
                  </SidebarMenuButton>
                </div>
              </SidebarMenuItem>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    className="hover:bg-pink-600 hover:text-white transition"
                  >
                    <Link href={item.url}>
                      {item.icon}
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
