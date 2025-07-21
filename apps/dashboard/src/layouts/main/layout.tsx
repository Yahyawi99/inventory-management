import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import Header from "@/layouts/main/header";
import Sidebar from "./sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <main className="flex w-full">
        <div>
          <Sidebar />
        </div>

        <div className="w-full">
          <Header />

          <div>{children}</div>
        </div>
      </main>
    </SidebarProvider>
  );
}
