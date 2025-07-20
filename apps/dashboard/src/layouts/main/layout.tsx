import Header from "@/layouts/main/header";
import { Sidebar } from "./sidebar";
import { Box, Flex } from "@radix-ui/themes";

export default function SideBarLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="w-[100vw]">
      <Flex>
        <Sidebar className="fixed hidden flex-col justify-between dark:bg-gray-50" />

        <Flex className="flex flex-col">
          <Header />
          <Box>{children}</Box>
        </Flex>
      </Flex>
    </main>
  );
}
