"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bar, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
} from "chart.js";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface PerformanceReport {
  id: string;
  date: string;
  totalCalls: number;
  totalEmails: number;
  requirementReceived: number;
  createdBy: {
    name: string;
  };
}

interface PerformanceChartsProps {
  reports: PerformanceReport[];
}

export function PerformanceCharts({ reports }: PerformanceChartsProps) {
  if (!reports || reports.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-muted-foreground">
            No performance data available
          </p>
        </CardContent>
      </Card>
    );
  }

  // Sort reports by date
  const sortedReports = [...reports].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  // Prepare data for charts
  const dates = sortedReports.map((r) =>
    new Date(r.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })
  );

  // Activity chart data (Calls + Emails over time)
  const activityData = {
    labels: dates,
    datasets: [
      {
        label: "Total Calls",
        data: sortedReports.map((r) => r.totalCalls),
        borderColor: "rgb(59, 130, 246)",
        backgroundColor: "rgba(59, 130, 246, 0.5)",
        tension: 0.3,
      },
      {
        label: "Total Emails",
        data: sortedReports.map((r) => r.totalEmails),
        borderColor: "rgb(16, 185, 129)",
        backgroundColor: "rgba(16, 185, 129, 0.5)",
        tension: 0.3,
      },
    ],
  };

  // Requirements chart data
  const requirementsData = {
    labels: dates,
    datasets: [
      {
        label: "Requirements Received",
        data: sortedReports.map((r) => r.requirementReceived),
        backgroundColor: "rgba(139, 92, 246, 0.7)",
        borderColor: "rgb(139, 92, 246)",
        borderWidth: 1,
      },
    ],
  };

  // Performance by employee (aggregate)
  const employeeStats = reports.reduce((acc, report) => {
    const name = report.createdBy.name;
    if (!acc[name]) {
      acc[name] = { calls: 0, emails: 0, requirements: 0 };
    }
    acc[name].calls += report.totalCalls;
    acc[name].emails += report.totalEmails;
    acc[name].requirements += report.requirementReceived;
    return acc;
  }, {} as Record<string, { calls: number; emails: number; requirements: number }>);

  const employeeNames = Object.keys(employeeStats);
  const employeePerformanceData = {
    labels: employeeNames,
    datasets: [
      {
        label: "Total Calls",
        data: employeeNames.map((name) => employeeStats[name].calls),
        backgroundColor: "rgba(59, 130, 246, 0.7)",
      },
      {
        label: "Total Emails",
        data: employeeNames.map((name) => employeeStats[name].emails),
        backgroundColor: "rgba(16, 185, 129, 0.7)",
      },
      {
        label: "Requirements",
        data: employeeNames.map((name) => employeeStats[name].requirements),
        backgroundColor: "rgba(139, 92, 246, 0.7)",
      },
    ],
  };

  const lineOptions: ChartOptions<"line"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          precision: 0,
        },
      },
    },
  };

  const barOptions: ChartOptions<"bar"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          precision: 0,
        },
      },
    },
  };

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Activity Over Time */}
      <Card>
        <CardHeader>
          <CardTitle>Activity Over Time</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <Line data={activityData} options={lineOptions} />
          </div>
        </CardContent>
      </Card>

      {/* Requirements Received */}
      <Card>
        <CardHeader>
          <CardTitle>Requirements Received</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <Bar data={requirementsData} options={barOptions} />
          </div>
        </CardContent>
      </Card>

      {/* Employee Performance Comparison */}
      {employeeNames.length > 0 && (
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Performance by Employee</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <Bar data={employeePerformanceData} options={barOptions} />
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}






