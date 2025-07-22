"use client";

import { useState } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarTrigger,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { faClose } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { MenuItems } from "./sidebar-menu-items";
import Image from "next/image";

export default function MainSidebar() {
  const [items, setItems] = useState(MenuItems);

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex justify-between items-center rounded-(--radius) my-5 ">
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
        {items.map((item) => {
          const {} = item;
          return <SidebarGroup>{"dashboard"}</SidebarGroup>;
        })}
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  );
}
