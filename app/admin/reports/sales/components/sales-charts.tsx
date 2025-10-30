"use client";

import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DailySales } from "@/types/reports";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { Line, Pie } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

interface SalesChartsProps {
  dailySales: DailySales[];
  categoryDistribution: Record<string, number>;
}

const CHART_COLORS = [
  "rgb(255, 99, 132)",
  "rgb(54, 162, 235)",
  "rgb(255, 206, 86)",
  "rgb(75, 192, 192)",
  "rgb(153, 102, 255)",
  "rgb(255, 159, 64)",
];

export function SalesCharts({
  dailySales,
  categoryDistribution,
}: SalesChartsProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const lineChartData = {
    labels: dailySales.map((sale) =>
      new Date(sale.date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      })
    ),
    datasets: [
      {
        label: "Daily Sales",
        data: dailySales.map((sale) => sale.total),
        borderColor: "rgb(75, 192, 192)",
        backgroundColor: "rgba(75, 192, 192, 0.5)",
        tension: 0.4,
      },
    ],
  };

  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            return formatCurrency(context.parsed.y);
          },
        },
      },
    },
    scales: {
      y: {
        ticks: {
          callback: (value: any) => formatCurrency(value),
        },
      },
    },
  };

  const pieChartData = {
    labels: Object.keys(categoryDistribution),
    datasets: [
      {
        data: Object.values(categoryDistribution),
        backgroundColor: CHART_COLORS,
        borderColor: CHART_COLORS.map((color) => color.replace("rgb", "rgba").replace(")", ", 0.8)")),
        borderWidth: 1,
      },
    ],
  };

  const pieChartOptions = useMemo(() => {
    const isDesktop = typeof window !== "undefined" && window.matchMedia("(min-width: 768px)").matches;
    return {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: (isDesktop ? "right" : "bottom") as "right" | "bottom",
        },
        tooltip: {
          callbacks: {
            label: (context: any) => {
              const label = context.label || "";
              const value = formatCurrency(context.raw);
              return `${label}: ${value}`;
            },
          },
        },
      },
    };
  }, []);

  return (
    <>
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Sales Over Time</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[260px] sm:h-[320px] md:h-[350px]">
            <Line data={lineChartData} options={lineChartOptions} />
          </div>
        </CardContent>
      </Card>

      <Card className="w-full">
        <CardHeader>
          <CardTitle>Sales by Category</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[260px] sm:h-[320px] md:h-[350px]">
            <Pie data={pieChartData} options={pieChartOptions} />
          </div>
        </CardContent>
      </Card>
    </>
  );
}

