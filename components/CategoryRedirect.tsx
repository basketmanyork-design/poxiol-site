"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function CategoryRedirect() {
  const router = useRouter();

  useEffect(() => {
    // Mapping of old slugs to new paths
    const mapping: Record<string, string> = {
      "custom-basketball-uniforms": "/products/basketball-uniforms/",
      "custom-soccer-kits": "/products/soccer-jerseys/",
      "custom-training-wear": "/products/training-wear/",
      "custom-american-football-uniforms": "/products/",
      "custom-baseball-softball-uniforms": "/products/",
      "custom-esports-jerseys": "/products/",
      "custom-golf-wear": "/products/",
      "custom-ice-hockey-jerseys": "/products/",
      "custom-rugby-uniforms": "/products/",
      "custom-running-marathon-wear": "/products/",
      "custom-tennis-wear": "/products/",
      "custom-volleyball-uniforms": "/products/",
    };

    const path = window.location.pathname.split("/").filter(Boolean).pop();
    const newPath = mapping[path || ""] || "/products/";

    router.replace(newPath);
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0A0A0A] text-white">
      <div className="text-center">
        <p className="text-sm font-bold uppercase tracking-widest text-[#B6FF00]">Redirecting</p>
        <h1 className="mt-4 text-2xl font-black uppercase">Moving to New Location...</h1>
        <p className="mt-6 text-neutral-500">If you are not redirected, <a href="/products/" className="underline">click here</a>.</p>
      </div>
    </div>
  );
}
