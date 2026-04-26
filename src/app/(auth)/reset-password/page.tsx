"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { createClient } from "@/lib/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Lock, Eye, EyeOff, CheckCircle2 } from "lucide-react";

const schema = z.object({
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(6, "Please confirm your password"),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});
type FormData = z.infer<typeof schema>;

export default function ResetPasswordPage() {
  const router = useRouter();
  const supabase = createClient();
  const [showPw, setShowPw] = useState(false);
  const [done, setDone] = useState(false);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async ({ password }: FormData) => {
    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      toast.error(error.message);
      return;
    }

    setDone(true);
    toast.success("Password updated!");
    setTimeout(() => router.push("/dashboard"), 1500);
  };

  if (done) {
    return (
      <div className="animate-fade-in text-center py-10">
        <div className="inline-flex h-16 w-16 rounded-full bg-success/10 text-success mb-6 items-center justify-center">
          <CheckCircle2 className="h-8 w-8" />
        </div>
        <h1 className="font-display text-3xl font-light text-white mb-3">All done!</h1>
        <p className="font-body text-sm text-mist">
          Your password has been updated. Redirecting to dashboard...
        </p>
      </div>
    );
  }

  return (
    <div className="animate-fade-up">
      <div className="mb-8">
        <h1 className="font-display text-4xl font-light text-white mb-2">New password</h1>
        <p className="font-body text-sm text-mist">
          Enter a new password for your account.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="New Password"
          type={showPw ? "text" : "password"}
          placeholder="Enter new password"
          icon={<Lock className="h-4 w-4" />}
          iconRight={
            <button type="button" onClick={() => setShowPw(p => !p)} className="text-mist hover:text-silver transition-colors cursor-pointer">
              {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          }
          error={errors.password?.message}
          {...register("password")}
        />
        <Input
          label="Confirm Password"
          type={showPw ? "text" : "password"}
          placeholder="Confirm new password"
          icon={<Lock className="h-4 w-4" />}
          error={errors.confirmPassword?.message}
          {...register("confirmPassword")}
        />

        <Button type="submit" size="lg" loading={isSubmitting} className="w-full mt-2">
          Update Password
        </Button>
      </form>
    </div>
  );
}