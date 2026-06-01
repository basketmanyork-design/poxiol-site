"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SportsRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/#sports-categories");
  }, [router]);

  return (
    <div className="flex h-screen w-full items-center justify-center bg-neutral-950 text-white">
      <div className="text-center">
        <h1 className="text-2xl font-black">Redirecting to Sports Categories...</h1>
        <p className="mt-4 text-neutral-400">Please wait while we take you to the right page.</p>
      </div>
    </div>
  );
}
