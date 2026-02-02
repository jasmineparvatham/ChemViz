import React from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip, Legend } from "chart.js";
import { chartColors, baseOptions } from "./chartTheme";
ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

export default function TypeDistributionBar({ distribution }) {
  if (!distribution) return null;

  const labels = Object.keys(distribution);
  const values = Object.values(distribution);

  const data = {
    labels,
    datasets: [{
      label: "Equipment Count",
      data: values,
      backgroundColor: chartColors.blue,
      borderRadius: 8,
    }],
  };

  return <Bar data={data} options={baseOptions()} />;
}
