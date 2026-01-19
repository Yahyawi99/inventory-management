"use client";

import { useEffect, useState } from "react";
import SignUpForm from "@/components/forms/sign-up/Sign-up-form";
import Logo from "@/components/forms/Auth-logo";
import { getBrowserTheme } from "@/utils/getBrowserTheme";

export default function SignUp() {
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedTheme = localStorage.getItem("theme");
      if (storedTheme) {
        setTheme(storedTheme);
      } else {
        if (getBrowserTheme() === "dark") {
          setTheme("dark");
        } else {
          setTheme("light");
        }
      }
    }
  }, []);

  return (
    <div
      className={`${theme} h-[100vh] bg-background flex flex-col items-center py-5 overflow-y-scroll`}
    >
      <Logo />

      <SignUpForm />
    </div>
  );
}
