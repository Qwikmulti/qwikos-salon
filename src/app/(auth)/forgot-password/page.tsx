"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { createClient } from "@/lib/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Mail, ArrowLeft, CheckCircle2 } from "lucide-react";

const schema = z.object({
  email: z.string().email("Enter a valid email address"),
});
type FormData = z.infer<typeof schema>;

export default function ForgotPasswordPage() {
  const supabase = createClient();
  const [sent, setSent] = useState(false);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async ({ email }: FormData) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) {
      toast.error(error.message);
      return;
    }

    setSent(true);
  };

  if (sent) {
    return (
      <div className="animate-fade-in text-center py-10">
        <div className="inline-flex h-16 w-16 rounded-full bg-success/10 text-success mb-6 items-center justify-center">
          <CheckCircle2 className="h-8 w-8" />
        </div>
        <h1 className="font-display text-3xl font-light text-white mb-3">Check your email</h1>
        <p className="font-body text-sm text-mist mb-8 max-w-sm mx-auto">
          We sent a password reset link to your email. Click the link in the email to create a new password.
        </p>
        <p className="font-body text-xs text-ash">
          Didn't receive it?{" "}
          <button onClick={() => setSent(false)} className="text-gold hover:text-gold-light">
            Resend
          </button>
        </p>
      </div>
    );
  }

  return (
    <div className="animate-fade-up">
      <div className="mb-8">
        <h1 className="font-display text-4xl font-light text-white mb-2">Reset password</h1>
        <p className="font-body text-sm text-mist">
          Enter your email and we'll send you a reset link.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Email Address"
          type="email"
          placeholder="you@example.com"
          icon={<Mail className="h-4 w-4" />}
          error={errors.email?.message}
          {...register("email")}
        />

        <Button type="submit" size="lg" loading={isSubmitting} className="w-full">
          Send Reset Link
        </Button>
      </form>
    </div>
  );
}