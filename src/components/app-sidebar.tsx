"use client";
import { useEffect, useState } from "react";
import { Home, Telescope, SquareUserRound, Plus, LogOut } from "lucide-react";
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
import axios from "axios";
import { useUser } from "@/app/context/usercontext";

export function AppSidebar() {
  const { user, setUser } = useUser(); // Get user context

  const handleLogout = async () => {
    try {
      // Send a logout request to the API to clear the JWT token on the server
      const apiUrl = process.env.API_CONNECTION_STRING;
      await axios.post(`${apiUrl}/auth/logout`, {}, { withCredentials: true });

      // Remove token and user data from localStorage
      localStorage.removeItem("token"); // Clear token (if stored separately)
      localStorage.removeItem("user"); // Clear user data

      // Update UI state to reflect the user is logged out
      setUser(null);

      // Redirect to home or login page after logout
      window.location.href = "/";
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  // Menu items for logged-in users
  const items = [
    {
      title: "Home",
      url: "/",
      icon: <Home color="white" />,
    },
    {
      title: "Research",
      url: "/statistics",
      icon: <Telescope color="white" />,
    },
    ...(user?.role === "admin"
      ? [
          {
            title: "Flagged Users",
            url: "/flagged",
            icon: <SquareUserRound color="white" />,
          },
        ]
      : []),
    user
      ? {
          title: "Logout",
          url: "#",
          icon: <LogOut color="white" />,
          onClick: handleLogout, // Logout logic
        }
      : {
          title: "Login",
          url: "/login",
          icon: <SquareUserRound color="white" />,
        },
  ];

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
              {items.map((item, index) => (
                <SidebarMenuItem key={index}>
                  <SidebarMenuButton
                    asChild
                    className="hover:bg-pink-600 hover:text-white transition"
                    onClick={item.onClick} // Handle logout action
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
