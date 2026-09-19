import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import MemberPortalClient from "@/components/MemberPortalClient";

export default function MemberPortalPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#E5E9EE] flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-red-600" />
        </div>
      }
    >
      <MemberPortalClient />
    </Suspense>
  );
}
