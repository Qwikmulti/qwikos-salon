"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { createClient } from "@/lib/supabase/client";
import { Input }  from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast }  from "sonner";
import { User, Mail, Lock, Phone, Eye, EyeOff, ArrowRight, Check } from "lucide-react";

const schema = z.object({
  fullName: z.string().min(2, "Enter your full name"),
  email:    z.string().email("Enter a valid email"),
  phone:    z.string().min(10, "Enter a valid phone number").optional().or(z.literal("")),
  password: z.string()
    .min(8, "At least 8 characters")
    .regex(/[A-Z]/, "Include at least one uppercase letter")
    .regex(/[0-9]/, "Include at least one number"),
  confirm:  z.string(),
}).refine(d => d.password === d.confirm, { message: "Passwords don't match", path: ["confirm"] });

type FormData = z.infer<typeof schema>;

const passwordRules = [
  { test: (p: string) => p.length >= 8,     label: "At least 8 characters" },
  { test: (p: string) => /[A-Z]/.test(p),   label: "One uppercase letter"  },
  { test: (p: string) => /[0-9]/.test(p),   label: "One number"            },
];

export default function RegisterPage() {
  const router   = useRouter();
  const supabase = createClient();
  const [showPw, setShowPw] = useState(false);

  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const password = watch("password", "");

  const onSubmit = async ({ email, password, fullName, phone }: FormData) => {
    const { error } = await supabase.auth.signUp({
      email, password,
      options: { data: { full_name: fullName, phone: phone || null } },
    });
    if (error) { toast.error(error.message); return; }
    toast.success("Account created!", { description: "Check your email to confirm your account." });
    router.push("/onboarding");
  };

  const signUpWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options:  { redirectTo: `${window.location.origin}/api/auth/callback?next=/onboarding` },
    });
  };

  return (
    <div className="animate-fade-up">
      <div className="mb-8">
        <h1 className="font-display text-4xl font-light text-white mb-2">Create account</h1>
        <p className="font-body text-sm text-mist">
          Already have one?{" "}
          <Link href="/login" className="text-gold hover:text-gold-light transition-colors font-medium">Sign in</Link>
        </p>
      </div>

      {/* OAuth */}
      <button
        onClick={signUpWithGoogle}
        className="w-full flex items-center justify-center gap-3 h-11 rounded-xl border border-ash bg-graphite hover:border-gold/30 hover:bg-smoke transition-all duration-200 font-body text-sm text-silver hover:text-pearl mb-6"
      >
        <svg className="h-4 w-4" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
        </svg>
        Continue with Google
      </button>

      <div className="flex items-center gap-3 mb-6">
        <div className="flex-1 h-px bg-ash/40" />
        <span className="font-body text-xs text-mist uppercase tracking-widest">or</span>
        <div className="flex-1 h-px bg-ash/40" />
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input label="Full Name"  placeholder="Adaeze Okonkwo"   icon={<User  className="h-4 w-4" />} error={errors.fullName?.message} {...register("fullName")} />
        <Input label="Email"      type="email" placeholder="you@example.com" icon={<Mail  className="h-4 w-4" />} error={errors.email?.message}    {...register("email")}    />
        <Input label="Phone (optional)" type="tel" placeholder="+44 801 234 5678" icon={<Phone className="h-4 w-4" />} error={errors.phone?.message} {...register("phone")} />

        <Input
          label="Password"
          type={showPw ? "text" : "password"}
          placeholder="Create a strong password"
          icon={<Lock className="h-4 w-4" />}
          iconRight={
            <button type="button" onClick={() => setShowPw(p => !p)} className="text-mist hover:text-silver transition-colors cursor-pointer">
              {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          }
          error={errors.password?.message}
          {...register("password")}
        />

        {/* Password strength */}
        {password.length > 0 && (
          <div className="flex flex-col gap-1.5 px-1">
            {passwordRules.map(({ test, label }) => (
              <div key={label} className="flex items-center gap-2">
                <div className={`h-4 w-4 rounded-full flex items-center justify-center transition-colors ${test(password) ? "bg-success text-white" : "bg-smoke border border-ash"}`}>
                  {test(password) && <Check className="h-2.5 w-2.5" />}
                </div>
                <span className={`font-body text-xs transition-colors ${test(password) ? "text-success-text" : "text-ash"}`}>{label}</span>
              </div>
            ))}
          </div>
        )}

        <Input
          label="Confirm Password"
          type={showPw ? "text" : "password"}
          placeholder="Repeat your password"
          icon={<Lock className="h-4 w-4" />}
          error={errors.confirm?.message}
          {...register("confirm")}
        />

        <Button type="submit" size="lg" loading={isSubmitting} className="w-full mt-2">
          Create Account
          <ArrowRight className="h-4 w-4" />
        </Button>
      </form>

      <p className="mt-8 text-center font-body text-xs text-ash">
        By registering, you agree to our{" "}
        <Link href="/terms" className="text-mist hover:text-silver">Terms</Link> and{" "}
        <Link href="/privacy" className="text-mist hover:text-silver">Privacy Policy</Link>
      </p>
    </div>
  );
}
