import { useState } from "react";
import * as NavigationMenu from "@radix-ui/react-navigation-menu";
import { MenuItems } from "@/layouts/sidebar/sidebar-menu-items";
import { MenuItemsType } from "@/types/sidebar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function NavMenu() {
  const [items, setItems] = useState(MenuItems);

  return (
    <NavigationMenu.Root className="w-64 h-dvh bg-gray-800 text-white p-4 space-y-2">
      <NavigationMenu.List className="flex flex-col space-y-2">
        {items.map((item: MenuItemsType) => {
          const { icon } = item;
          return (
            <NavigationMenu.Item>
              <NavigationMenu.Link
                className="block p-2 rounded hover:bg-gray-700"
                href="#"
              >
                <FontAwesomeIcon icon={icon} />
              </NavigationMenu.Link>
            </NavigationMenu.Item>
          );
        })}
      </NavigationMenu.List>
    </NavigationMenu.Root>
  );
}
