import MainLayout from "@/layouts/main/layout";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <MainLayout>{children}</MainLayout>
    </div>
  );
}
