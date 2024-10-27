import { login } from "../actions";
import { redirect } from "next/navigation";
import AuthForm from "@/components/AuthForm";
import { createClient } from "@/lib/supabase/server";

export default async function LoginPage() {
  const supabase = await createClient();
  const { error } = await supabase.auth.getUser();
  if (!error) {
    return redirect("/");
  }
  return (
    <div className="flex items-center justify-center p-4 h-full">
      <div className="w-full max-w-md bg-white rounded-lg shadow-xl overflow-hidden p-6">
        <AuthForm onSubmit={login} formType="login" />
      </div>
    </div>
  );
}
