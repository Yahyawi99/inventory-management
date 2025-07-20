import Image from "next/image";
import { Box, Flex } from "@radix-ui/themes";

export default function Home() {
  return (
    <Box className="flex-1">
      <Flex>
        <main className="min-w-lvw">
          <h1>MAIN</h1>
        </main>
      </Flex>
    </Box>
  );
}
