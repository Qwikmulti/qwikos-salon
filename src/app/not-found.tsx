import Link from "next/link";
import { Home, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-6 animate-fade-in">
      <div className="mb-6">
        <span className="font-display text-9xl font-light text-gold/20">404</span>
      </div>
      <h1 className="font-display text-3xl font-light text-white mb-3">Page not found</h1>
      <p className="font-body text-sm text-mist mb-8 max-w-md">
        Sorry, we couldn't find the page you're looking for. It may have been moved or doesn't exist.
      </p>
      <div className="flex gap-3">
        <Button variant="secondary" onClick={() => window.history.back()}>
          <ArrowLeft className="h-4 w-4" /> Go Back
        </Button>
        <Button asChild>
          <Link href="/">
            <Home className="h-4 w-4" /> Home
          </Link>
        </Button>
      </div>
    </div>
  );
}