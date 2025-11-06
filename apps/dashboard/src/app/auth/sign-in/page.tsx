"use client";

import { useEffect, useState } from "react";
import SignInForm from "@/components/forms/sign-in/Sign-in-form";
import Logo from "@/components/forms/Auth-logo";
import { getBrowserTheme } from "@/utils/getBrowserTheme";

export default function SignIn() {
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
      className={`${theme} bg-background h-lvh flex flex-col items-center justify-center`}
    >
      <Logo />

      <SignInForm />
    </div>
  );
}
