import RegisterForm from "@/components/auth/RegisterForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Register | Oncobuddy",
  description: "Create your patient account on Oncobuddy to start your clinical care journey.",
};

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <RegisterForm />
    </div>
  );
}
