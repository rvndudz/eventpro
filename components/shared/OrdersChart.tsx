"use client";

import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { IOrderItem } from "@/lib/database/models/order.model";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface OrdersChartProps {
  orders: IOrderItem[];
}

const OrdersChart: React.FC<OrdersChartProps> = ({ orders }) => {
  // 1. Group orders by date and compute total amounts
  const groupedData = orders.reduce((acc: Record<string, number>, order) => {
    // Convert createdAt to a date string; e.g. "2025-01-13"
    const date = new Date(order.createdAt).toLocaleDateString("en-CA"); 
    // If you want a different format, change it here
    if (!acc[date]) {
      acc[date] = 0;
    }
    acc[date] += Number(order.totalAmount);
    return acc;
  }, {});

  // 2. Sort dates to ensure the chart shows them in chronological order
  const sortedDates = Object.keys(groupedData).sort(
    (a, b) => new Date(a).getTime() - new Date(b).getTime()
  );

  // 3. Prepare chart data
  const chartData = {
    labels: sortedDates,
    datasets: [
      {
        label: "Total Orders Over Time",
        data: sortedDates.map((date) => groupedData[date]),
        backgroundColor: "rgba(53, 162, 235, 0.5)", 
      },
    ],
  };

  // 4. (Optional) You can customize chart options 
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Orders Growth (Amount)",
      },
    },
  };

  return <Bar data={chartData} options={options} />;
};

export default OrdersChart;
