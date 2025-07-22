"use client";

import { useState } from "react";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@radix-ui/react-collapsible";
import { MenuItemType } from "@/types/sidebar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";

export default function MySidebarMenu({ item }: { item: MenuItemType }) {
  const { id, name, icon, href, subMenuItems } = item; // destructure icon

  return (
    <SidebarMenu>
      {subMenuItems.length ? (
        <Collapsible className="mb-3 text-(--border)">
          <SidebarMenuItem key={id}>
            <CollapsibleTrigger asChild>
              <SidebarMenuButton>
                <FontAwesomeIcon icon={icon} />
                <span className="text-[1.25rem]">{name}</span>
              </SidebarMenuButton>
            </CollapsibleTrigger>

            <CollapsibleContent>
              <SidebarMenuSub>
                {subMenuItems.map((subItem) => {
                  const { id: subId, name: subItemName, href } = subItem;
                  return (
                    <SidebarMenuSubItem key={subId}>
                      <SidebarMenuSubButton asChild>
                        <Link href={href}>
                          <span className="text-[1rem]">{subItemName}</span>
                        </Link>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  );
                })}
              </SidebarMenuSub>
            </CollapsibleContent>
          </SidebarMenuItem>
        </Collapsible>
      ) : (
        <SidebarMenuItem key={id} className="mb-3 px-2 text-(--border)">
          <FontAwesomeIcon icon={icon} className="mr-2" />
          <Link href={href as string}>
            <span className="text-[1.25rem]">{name}</span>
          </Link>
        </SidebarMenuItem>
      )}
    </SidebarMenu>
  );
}
