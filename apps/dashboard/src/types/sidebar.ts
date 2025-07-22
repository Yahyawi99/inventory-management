import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";

export interface SubMenuItemType {
  id: string;
  name: string;
  description?: string;
  href: string;
  badge?: string;
}

export interface MenuItemType {
  id: string;
  name: string;
  icon: IconDefinition;
  href?: string;
  description?: string;
  badge?: string;
  subMenuItems: SubMenuItemType[];
}
