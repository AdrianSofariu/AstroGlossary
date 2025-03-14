import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar} from "@/components/app-sidebar";

import "./globals.css";
import { ContextProvider } from "./context";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html>
      <body className={`${geistSans.variable} ${geistMono} antialiased}` }>
        <ContextProvider>
        <SidebarProvider>
          <AppSidebar />
            <main className="w-full">
              <SidebarTrigger className="hover:bg-pink-500 cursor-pointer"/>
                {children}
            </main>
        </SidebarProvider>
        </ContextProvider>
      </body>
    </html>
  );
}
