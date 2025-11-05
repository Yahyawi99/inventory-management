"use client";

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "app-core/src/components";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "app-core/src/components";
import { MenuItemType } from "@/types/sidebar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";

export default function MySidebarMenu({ item }: { item: MenuItemType }) {
  const { id, name, icon, href, subMenuItems } = item; // destructure icon

  return (
    <SidebarMenu>
      {subMenuItems.length ? (
        <Collapsible
          className="group mb-3 text-(--border) dark:text-foreground"
          defaultOpen={false}
        >
          <SidebarMenuItem key={id}>
            <CollapsibleTrigger
              className="data-[state=open]:hover:text-(--ring) hover:text-(--ring) data-[state=open]:active:text-(--ring) data-[state=closed]:active:text-(--ring) cursor-pointer"
              asChild
            >
              <SidebarMenuButton className="flex justify-between hover:!bg-transparent focus:!bg-transparent active:!bg-transparent hover:text-(--ring)">
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
                        className="hover:!bg-transparent focus:!bg-transparent active:!bg-transparent  text-(--border) decoration-3 hover:underline hover:text-(--border) dark:text-muted-foreground"
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
          className="mb-3 px-2 dark:text-foreground text-(--border) hover:!text-(--ring)"
        >
          <FontAwesomeIcon icon={icon} className="mr-2 text-inherit" />
          <Link href={href as string} className="text-inherit">
            <span className="text-[1.25rem] font-bold">{name}</span>
          </Link>
        </SidebarMenuItem>
      )}
    </SidebarMenu>
  );
}
