"use client";

import LanyardWithControls from "@/components/lanyard-with-controls";

export default function LanyardPage() {
  return (
    <main className="relative flex min-h-dvh flex-col items-center justify-center">
      <div className="relative w-full max-w-2xl">
        <LanyardWithControls
          position={[0, 0, 18]}
          containerClassName="relative aspect-square w-full"
        />
      </div>
    </main>
  );
}
