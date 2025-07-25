"use client";
import { Bebas_Neue } from "next/font/google";
import {
  faBell,
  faCircle,
  faSliders,
  faHandPeace,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useSidebar } from "@/components/ui/sidebar";

const BebasNeue = Bebas_Neue({
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
});

export default function Header() {
  const { open } = useSidebar();

  return (
    <header className="flex items-center justify-between p-5 my-5 bg-(--card) shadow-md shadow-gray-300 rounded-(--radius)">
      <div className="flex items-center gap-2">
        <FontAwesomeIcon icon={faHandPeace} className="text-(--chart-4)" />
        <h1>
          Hello,{" "}
          <span className={`${BebasNeue.className} underline decoration-2`}>
            Yassine Yahyawi
          </span>
          !
        </h1>
      </div>

      <div className="flex items-center gap-[20px]">
        <div className="relative">
          <FontAwesomeIcon
            icon={faBell}
            className="cursor-pointer text-(--muted-foreground) scale-110"
          />
          <FontAwesomeIcon
            icon={faCircle}
            className="absolute text-(--destructive) bottom-4 left-2"
            width={8}
          />
        </div>

        <div>
          <FontAwesomeIcon
            icon={faSliders}
            className="cursor-pointer text-(--muted-foreground) scale-110"
          />
        </div>
      </div>
    </header>
  );
}
