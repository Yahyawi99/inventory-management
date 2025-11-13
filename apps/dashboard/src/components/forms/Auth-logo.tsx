import Image from "next/image";
import LogoImage from "@/../public/assets/images/logo-auth.png";

export default function () {
  return (
    <div className="flex items-center">
      <Image src={LogoImage} width={75} height={75} alt="WareFlow-logo" />

      <h1 className="text-3xl text-sidebar h-[35px]">WareFlow</h1>
    </div>
  );
}
