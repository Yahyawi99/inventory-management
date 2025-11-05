"use client";

import { SidebarProvider } from "app-core/src/components";
import { useTheme } from "@/context";
import Sidebar from "./sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
  const { theme } = useTheme();

  return (
    <SidebarProvider>
      <main className={`flex w-full ${theme}`}>
        <div>
          <Sidebar />
        </div>

        <div className="w-full px-3 overflow-x-hidden bg-background text-foreground">
          <div>{children}</div>
        </div>
      </main>
    </SidebarProvider>
  );
}
