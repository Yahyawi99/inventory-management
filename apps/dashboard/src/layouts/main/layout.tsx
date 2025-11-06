"use client";

import { useEffect } from "react";
import { SidebarProvider } from "app-core/src/components";
import { useTheme } from "@/context";
import Sidebar from "./sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
  const { theme } = useTheme();

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  return (
    <SidebarProvider>
      <main className={`flex w-full ${theme}`}>
        <div>
          <Sidebar />
        </div>

        <div className="h-[100vh] w-full px-3 bg-background overflow-x-hidden text-foreground pb-5">
          {children}
        </div>
      </main>
    </SidebarProvider>
  );
}
