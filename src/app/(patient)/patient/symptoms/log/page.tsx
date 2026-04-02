import DailyLogForm from "@/components/symptoms/DailyLogForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Daily Symptom Log | Oncobuddy",
  description: "Record your daily health status and symptoms using the clinically validated PRO-CTCAE framework.",
};

export default function LogPage() {
  return (
    <div className="min-h-screen">
      <DailyLogForm />
    </div>
  );
}
