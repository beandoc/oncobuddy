import Link from "next/link";
import { Button, GlassCard } from "@/components/ui/core";
import { Search, ChevronLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <GlassCard className="max-w-md w-full !p-12 text-center space-y-8">
        <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center mx-auto">
          <Search className="w-10 h-10 text-slate-300" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-bold font-outfit text-slate-900">Patient Not Found</h1>
          <p className="text-sm text-slate-500 font-medium">
            The clinical record you are looking for does not exist in the current registry. It may have been archived or deleted.
          </p>
        </div>
        <Link href="/oncologist/dashboard">
          <Button className="w-full h-12 bg-slate-900 text-white font-bold text-xs uppercase tracking-widest gap-2">
            <ChevronLeft className="w-4 h-4" /> Return to Dashboard
          </Button>
        </Link>
      </GlassCard>
    </div>
  );
}
