import Image from "next/image";
import { Box, Flex } from "@radix-ui/themes";
import * as NavigationMenu from "@radix-ui/react-navigation-menu";

export default function Home() {
  return (
    <Box className="flex-1">
      <Flex>
        <NavigationMenu.Root className="w-64 h-dvh bg-gray-800 text-white p-4 space-y-2">
          <NavigationMenu.List className="flex flex-col space-y-2">
            <NavigationMenu.Item>
              <NavigationMenu.Link
                className="block p-2 rounded hover:bg-gray-700"
                href="#"
              >
                Dashboard
              </NavigationMenu.Link>
            </NavigationMenu.Item>
            <NavigationMenu.Item>
              <NavigationMenu.Link
                className="block p-2 rounded hover:bg-gray-700"
                href="#"
              >
                Orders
              </NavigationMenu.Link>
            </NavigationMenu.Item>
            <NavigationMenu.Item>
              <NavigationMenu.Link
                className="block p-2 rounded hover:bg-gray-700"
                href="#"
              >
                Products
              </NavigationMenu.Link>
            </NavigationMenu.Item>
          </NavigationMenu.List>
        </NavigationMenu.Root>

        <main className="min-w-lvw">
          <h1>MAIN</h1>
        </main>
      </Flex>
    </Box>
  );
}
