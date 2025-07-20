"use client";

import { useState } from "react";
import { MenuItems } from "@/layouts/main/sidebar-menu-items";
import { MenuItemsType } from "@/types/sidebar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function SidebarMenu() {
  const [items, setItems] = useState(MenuItems);

  return <div>side</div>;
}
