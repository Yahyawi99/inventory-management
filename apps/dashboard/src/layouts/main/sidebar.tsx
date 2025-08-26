"use client";

import { useState } from "react";
import { MenuItems } from "./sidebar-menu-items";
import SidebarMenu from "./sidebar-menu";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarTrigger,
  SidebarHeader,
  SidebarGroup,
  SidebarGroupContent,
} from "app-core/src/components";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "app-core/src/components";
import { faClose, faEllipsisV } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";

export default function MainSidebar() {
  const [items, setItems] = useState(MenuItems);

  return (
    <Sidebar>
      <SidebarHeader>
        <Header />
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            {items.map((item) => {
              return <SidebarMenu key={item.id} item={item} />;
            })}
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <Footer />
      </SidebarFooter>
    </Sidebar>
  );
}

const Header = () => {
  return (
    <div className="flex justify-between items-center pt-1 pb-0 mb-5 border-b-2">
      <div className="flex items-center">
        <Image
          src={"/assets/icons/logo.png"}
          width={75}
          height={75}
          alt="WareFlow-logo"
        />

        <h1 className="text-3xl text-(--color-secondary) h-[35px]">WareFlow</h1>
      </div>

      <div>
        <SidebarTrigger className="cursor-pointer mt-[10px]">
          <FontAwesomeIcon
            icon={faClose}
            className="text-(--color-secondary)"
          />
        </SidebarTrigger>
      </div>
    </div>
  );
};

const Footer = () => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Image
          src={"/assets/images/luffy.jpg"}
          width={100}
          height={100}
          alt="user-avatar"
          className="w-[50px] h-[50px] rounded-3xl"
        />

        <div className="text-[.9rem] text-[#1B3B6F] font-bold">
          <p>Yassine Yahyawi</p>
          <p>deidarayassine45@gmail.com</p>
        </div>
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger className="cursor-pointer outline-none">
          <FontAwesomeIcon
            icon={faEllipsisV}
            className="text-(--ring) cursor-pointer px-3"
          />
        </DropdownMenuTrigger>

        <DropdownMenuContent>
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Profile</DropdownMenuItem>
          <DropdownMenuItem>Billing</DropdownMenuItem>
          <DropdownMenuItem>Team</DropdownMenuItem>
          <DropdownMenuItem>Subscription</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
