import MainLayout from "@/layouts/main/layout";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="text-[1.1rem] bg-(--accent)">
      <MainLayout>{children}</MainLayout>
    </div>
  );
}
