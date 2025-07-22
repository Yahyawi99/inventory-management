"use client";

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
} from "@/components/ui/collapsible";
import { MenuItemType } from "@/types/sidebar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";

export default function MySidebarMenu({ item }: { item: MenuItemType }) {
  const { id, name, icon, href, subMenuItems } = item; // destructure icon

  return (
    <SidebarMenu>
      {subMenuItems.length ? (
        <Collapsible className="group mb-3 text-(--ring)" defaultOpen={false}>
          <SidebarMenuItem key={id}>
            <CollapsibleTrigger
              className="data-[state=open]:hover:text-(--border) hover:text-(--border) data-[state=open]:active:text-(--border) data-[state=closed]:active:text-(--border)"
              asChild
            >
              <SidebarMenuButton className="flex justify-between hover:!bg-transparent focus:!bg-transparent active:!bg-transparent hover:text-(--border)">
                <div>
                  <FontAwesomeIcon icon={icon} className="text-inherit mr-2" />
                  <span className="text-[1.25rem] font-bold ">{name}</span>
                </div>

                <FontAwesomeIcon
                  icon={faChevronRight}
                  className="transition-transform group-data-[state=open]:rotate-90 text-inherit"
                />
              </SidebarMenuButton>
            </CollapsibleTrigger>

            <CollapsibleContent>
              <SidebarMenuSub>
                {subMenuItems.map((subItem) => {
                  const { id: subId, name: subItemName, href } = subItem;
                  return (
                    <SidebarMenuSubItem key={subId}>
                      <SidebarMenuSubButton
                        className="hover:!bg-transparent focus:!bg-transparent active:!bg-transparent  text-(--ring) decoration-3 hover:underline hover:text-(--ring) "
                        asChild
                      >
                        <Link href={href!}>
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
        <SidebarMenuItem
          key={id}
          className="mb-3 px-2 text-(--ring) hover:text-(--border)"
        >
          <FontAwesomeIcon icon={icon} className="mr-2" />
          <Link href={href as string}>
            <span className="text-[1.25rem] font-bold">{name}</span>
          </Link>
        </SidebarMenuItem>
      )}
    </SidebarMenu>
  );
}
