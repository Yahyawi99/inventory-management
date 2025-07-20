import Header from "@/layouts/main/header";
import { Sidebar } from "./sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <main className="w-[100vw] bg-red-600">
      <div>
        <Sidebar className="fixed hidden flex-col justify-between" />
      </div>

      <div>
        <Header />

        <div>{children}</div>
      </div>
    </main>
  );
}
