'use client';

import { motion } from "framer-motion";

interface OutcomeVelocityChartProps {
  data: number[];
}

/**
 * Vanguard Clinical Intelligence Widget.
 * High-fidelity client-side motion chart for outcome velocity.
 */
export function OutcomeVelocityChart({ data }: OutcomeVelocityChartProps) {
  return (
    <div className="h-44 w-full flex items-end gap-3 px-1 relative">
      {/* Grid Lines */}
      <div className="absolute inset-0 flex flex-col justify-between opacity-5">
        {[1, 2, 3, 4].map(i => <div key={i} className="w-full h-px bg-white" />)}
      </div>
      {data.map((h, i) => (
        <div key={i} className="flex-1 bg-white/5 rounded-t-xl group relative overflow-hidden">
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: `${h}%` }}
            transition={{ duration: 1, delay: i * 0.1 }}
            className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-indigo-600/80 to-indigo-400 rounded-t-xl"
          />
        </div>
      ))}
    </div>
  );
}
