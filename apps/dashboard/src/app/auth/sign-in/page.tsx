"use client";
import { useEffect, useState } from "react";
import SignInForm from "@/components/forms/sign-in/Sign-in-form";
import Logo from "@/components/forms/Auth-logo";

export default function SignIn() {
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedTheme = localStorage.getItem("theme");
      if (storedTheme) setTheme(storedTheme);
    }
  }, []);

  return (
    <div className={`${theme} h-lvh flex flex-col items-center justify-center`}>
      <Logo />

      <SignInForm />
    </div>
  );
}
