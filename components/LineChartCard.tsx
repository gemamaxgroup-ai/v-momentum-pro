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
import { TrafficPoint } from "@/lib/mockDashboardData";

interface LineChartCardProps {
  data: TrafficPoint[];
  title?: string;
}

export default function LineChartCard({
  data,
  title = "Traffic Overview",
}: LineChartCardProps) {
  return (
    <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
      <h3 className="text-lg font-semibold text-white mb-6">{title}</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" />
          <XAxis
            dataKey="label"
            stroke="#9CA3AF"
            style={{ fontSize: "12px" }}
          />
          <YAxis stroke="#9CA3AF" style={{ fontSize: "12px" }} />
          <Tooltip
            contentStyle={{
              backgroundColor: "#1F2937",
              border: "1px solid #374151",
              borderRadius: "8px",
              color: "#FFFFFF",
            }}
          />
          <Line
            type="monotone"
            dataKey="users"
            stroke="#0EA5E9"
            strokeWidth={2}
            dot={{ fill: "#0EA5E9", r: 4 }}
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

