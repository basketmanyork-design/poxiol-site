"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SportsRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/products/");
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0A0A0A] text-white">
      <div className="text-center">
        <p className="text-sm font-bold uppercase tracking-widest text-[#B6FF00]">Redirecting</p>
        <h1 className="mt-4 text-2xl font-black uppercase">Moving to Products...</h1>
        <p className="mt-6 text-neutral-500">If you are not redirected, <a href="/products/" className="underline">click here</a>.</p>
      </div>
    </div>
  );
}
