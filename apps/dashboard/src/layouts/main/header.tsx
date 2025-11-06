"use client";
import { useAuth } from "@/context/AuthContext";
import { Bebas_Neue } from "next/font/google";
import Link from "next/link";
import {
  faBell,
  faCircle,
  faSliders,
  faHandPeace,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const BebasNeue = Bebas_Neue({
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
});

export default function Header() {
  const { user } = useAuth();

  return (
    <header className="flex items-center justify-between p-5 my-5 bg-(--card) shadow-md shadow-accent rounded-(--radius)">
      <div className="flex items-center gap-2">
        <FontAwesomeIcon icon={faHandPeace} className="text-yellow-400" />
        <h1>
          Hello,{" "}
          <span className={`${BebasNeue.className} underline decoration-2`}>
            {user?.name}
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

        <Link href={"/en/account/settings"}>
          <FontAwesomeIcon
            icon={faSliders}
            className="cursor-pointer text-(--muted-foreground) scale-110"
          />
        </Link>
      </div>
    </header>
  );
}
