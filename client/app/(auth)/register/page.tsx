import { redirect } from "next/navigation";

export default function Register() {
    // With our new Gmail-only OTP authentication, registration and login happen securely in one flow!
    redirect("/login");
}
