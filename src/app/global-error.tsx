"use client";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-6 animate-fade-in">
      <div className="h-16 w-16 rounded-full bg-danger/10 text-danger flex items-center justify-center mb-6">
        <AlertTriangle className="h-8 w-8" />
      </div>
      <h1 className="font-display text-3xl font-light text-white mb-3">Something went wrong</h1>
      <p className="font-body text-sm text-mist mb-8 max-w-md">
        An unexpected error occurred. Please try again.
      </p>
      <Button onClick={reset}>Try Again</Button>
    </div>
  );
}