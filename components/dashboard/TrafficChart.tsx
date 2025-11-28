"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { Ga4OverviewTrafficPoint } from "@/lib/ga4/overview";

interface TrafficChartProps {
  data: Ga4OverviewTrafficPoint[];
}

export default function TrafficChart({ data }: TrafficChartProps) {
  return (
    <div className="bg-vm-card/80 border border-vm-border rounded-xl p-4 sm:p-6">
      <h3 className="text-base sm:text-lg font-semibold text-vm-textMain mb-6">
        Traffic Overview
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
          <XAxis
            dataKey="date"
            stroke="#9ca3af"
            style={{ fontSize: "12px" }}
            tickFormatter={(value) => {
              // Formatear fecha YYYY-MM-DD a formato corto
              const date = new Date(value);
              return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
            }}
          />
          <YAxis stroke="#9ca3af" style={{ fontSize: "12px" }} />
          <Tooltip
            contentStyle={{
              backgroundColor: "#0b1220",
              border: "1px solid #1f2937",
              borderRadius: "8px",
              color: "#f9fafb",
            }}
          />
          <Line
            type="monotone"
            dataKey="users"
            stroke="#22c1f1"
            strokeWidth={2}
            dot={{ fill: "#22c1f1", r: 4 }}
            name="Users"
          />
          <Line
            type="monotone"
            dataKey="sessions"
            stroke="#6366F1"
            strokeWidth={2}
            dot={{ fill: "#6366F1", r: 4 }}
            name="Sessions"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

