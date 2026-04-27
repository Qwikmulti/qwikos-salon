"use client";
import { Button } from "@/components/ui/button";

export function RefreshButton() {
  return (
    <Button variant="ghost" onClick={() => window.location.reload()}>
      Refresh Status
    </Button>
  );
}
