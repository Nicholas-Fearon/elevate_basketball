"use client";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { LiveEvent } from "@/components/event-details";
function SelectedEvent() {
  const params = useSearchParams();
  return <LiveEvent id={params.get("id")} />;
}
export default function Page() {
  return (
    <Suspense
      fallback={
        <p className="p-10" role="status">
          Loading event…
        </p>
      }
    >
      <SelectedEvent />
    </Suspense>
  );
}
