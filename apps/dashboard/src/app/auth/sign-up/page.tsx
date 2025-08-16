import SignUpForm from "@/components/forms/sign-up/Sign-up-form";
import Logo from "@/components/forms/Auth-logo";

export default function SignUp() {
  return (
    <div className="flex flex-col items-center my-5">
      <Logo />

      <SignUpForm />
    </div>
  );
}
