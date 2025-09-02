import { SidebarProvider } from "app-core/src/components";
import Sidebar from "./sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <main className="flex w-full">
        <div>
          <Sidebar />
        </div>

        <div className="w-full mx-3 overflow-x-hidden">
          <div>{children}</div>
        </div>
      </main>
    </SidebarProvider>
  );
}
