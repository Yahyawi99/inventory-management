import SignInForm from "@/components/forms/sign-in/Sign-in-form";
import Logo from "@/components/forms/Auth-logo";

export default function SignIn() {
  return (
    <div className="h-lvh flex flex-col items-center justify-center">
      <Logo />

      <SignInForm />
    </div>
  );
}
