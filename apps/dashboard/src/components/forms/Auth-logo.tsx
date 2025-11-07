import Image from "next/image";

export default function () {
  return (
    <div className="flex items-center">
      <Image
        src={"/assets/icons/logo.png"}
        width={75}
        height={75}
        alt="WareFlow-logo"
      />

      <h1 className="text-3xl text-sidebar h-[35px]">WareFlow</h1>
    </div>
  );
}
