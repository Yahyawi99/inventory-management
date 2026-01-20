"use client";

import { useTranslations, useLocale } from "next-intl";
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
  const { id, name, icon, href, subMenuItems } = item;
  const t = useTranslations("sidebar");
  const locale = useLocale();

  return (
    <SidebarMenu>
      {subMenuItems.length ? (
        <Collapsible className="group mb-3 text-white" defaultOpen={false}>
          <SidebarMenuItem key={id}>
            <CollapsibleTrigger
              className="data-[state=open]:hover:text-primary hover:text-primary data-[state=open]:active:text-primary data-[state=closed]:active:text-primary cursor-pointer"
              asChild
            >
              <SidebarMenuButton className="flex justify-between hover:!bg-transparent focus:!bg-transparent active:!bg-transparent ">
                <div className="flex gap-2 items-center ">
                  <FontAwesomeIcon icon={icon} className="text-inherit" />
                  <span className="text-[1.25rem] font-bold ">{t(name)}</span>
                </div>

                <FontAwesomeIcon
                  icon={faChevronRight}
                  className="transition-transform group-data-[state=open]:rotate-90 text-inherit"
                />
              </SidebarMenuButton>
            </CollapsibleTrigger>

            <CollapsibleContent>
              <SidebarMenuSub className="border-white">
                {subMenuItems.map((subItem) => {
                  const { id: subId, name: subItemName, href } = subItem;
                  return (
                    <SidebarMenuSubItem key={subId}>
                      <SidebarMenuSubButton
                        className="hover:!bg-transparent focus:!bg-transparent active:!bg-transparent decoration-3 hover:underline dark:text-white text-white hover:text-white"
                        asChild
                      >
                        <Link href={`/${locale}` + href}>
                          <span className="text-[1rem]">{t(subItemName)}</span>
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
          className="flex gap-2 items-center mb-3 px-2 dark:text-foreground text-(--border) hover:!text-primary"
        >
          <FontAwesomeIcon icon={icon} className="text-inherit" />
          <Link href={`/${locale}` + href} className="text-inherit">
            <span className="text-[1.25rem] font-bold">{t(name)}</span>
          </Link>
        </SidebarMenuItem>
      )}
    </SidebarMenu>
  );
}
