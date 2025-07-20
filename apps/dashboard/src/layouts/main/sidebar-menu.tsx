"use client";

import { useState } from "react";
import * as NavigationMenu from "@radix-ui/react-navigation-menu";
import { MenuItems } from "@/layouts/main/sidebar-menu-items";
import { MenuItemsType } from "@/types/sidebar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function SidebarMenu() {
  const [items, setItems] = useState(MenuItems);

  return (
    <NavigationMenu.Root className=" h-dvh bg-gray-800 text-white">
      <NavigationMenu.List>
        {items.map((item: MenuItemsType) => {
          const { icon, id } = item;
          return (
            <NavigationMenu.Item key={id}>
              <NavigationMenu.Link href="/">
                <FontAwesomeIcon icon={icon} />
              </NavigationMenu.Link>
            </NavigationMenu.Item>
          );
        })}
      </NavigationMenu.List>
    </NavigationMenu.Root>
  );
}
