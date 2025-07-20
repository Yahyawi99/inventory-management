import { faBox } from "@fortawesome/free-solid-svg-icons";
import { routes } from "@config/routes";
import { MenuItemsType } from "@/types/sidebar";

export const MenuItems: MenuItemsType[] = [
  {
    id: "1",
    name: "sidebar-menu-dashboard",
    title: "sidebar-menu-overview",
    icon: faBox,
    menuItems: [
      {
        name: "sidebar-menu-file-manager",
        href: routes.dashboard,
        icon: faBox,
      },
    ],
  },
  // {
  //   id: "4",
  //   name: "sidebar-menu-organization-hub",
  //   title: "sidebar-menu-organization-hub",
  //   icon: PiBuilding,
  //   menuItems: [
  //     {
  //       name: "sidebar-menu-organization-dashboard",
  //       href: routes.organizationHub.dashboard,
  //       icon: PiTargetDuotone,
  //     },
  //     {
  //       name: "sidebar-menu-organization-feed",
  //       href: routes.organizationHub.feed,
  //       icon: PiBuilding,
  //     },
  //   ],
  // },
  // {
  //   id: "5",
  //   name: "sidebar-menu-forms",
  //   title: "sidebar-menu-forms",
  //   icon: PiNotePencilDuotone,
  //   menuItems: [
  //     {
  //       name: "sidebar-menu-account-settings",
  //       href: routes.forms.profileSettings,
  //       icon: PiUserGearDuotone,
  //     },
  //     {
  //       name: "sidebar-menu-notification-preference",
  //       href: routes.forms.notificationPreference,
  //       icon: PiBellSimpleRingingDuotone,
  //       badge: "",
  //     },
  //     {
  //       name: "sidebar-menu-personal-information",
  //       href: routes.forms.personalInformation,
  //       icon: PiUserCircleDuotone,
  //     },
  //     {
  //       name: "sidebar-menu-newsletter",
  //       href: routes.forms.newsletter,
  //       icon: PiEnvelopeSimpleOpenDuotone,
  //     },
  //   ],
  // },
];

// {
//   id: "3",
//   name: "sidebar-menu-initiative-hub",
//   title: "sidebar-menu-initiative-hub",
//   icon: PiHandHeartDuotone,
//   menuItems: [
//     {
//       name: "sidebar-menu-initiative-dashboard",
//       href: routes.initiativeHub.dashboard,
//       icon: PiTargetDuotone,
//     },
//     {
//       name: "sidebar-menu-initiative-feed",
//       href: routes.initiativeHub.feed,
//       icon: PiHandHeartDuotone,
//     },
//   ],
// },
