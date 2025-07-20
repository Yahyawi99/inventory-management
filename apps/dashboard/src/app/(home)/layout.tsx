import { Theme } from "@radix-ui/themes";
import MainLayout from "@/layouts/main/layout";

export default function DefaultLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <MainLayout>{children}</MainLayout>;
}
