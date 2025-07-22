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
} from "@/components/ui/sidebar";
import { faClose } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";

export default function MainSidebar() {
  const [items, setItems] = useState(MenuItems);

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex justify-between items-center  my-5 pb-5 border-b-2">
          <div className="flex">
            <Image
              src={"/logo.png"}
              width={100}
              height={100}
              alt="WareFlow-logo"
              className="w-[30px] h-[30px]"
            />

            <h1 className="text-3xl text-(--color-secondary) h-[35px] pt-[3px]">
              WareFlow
            </h1>
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
      <SidebarFooter />
    </Sidebar>
  );
}
