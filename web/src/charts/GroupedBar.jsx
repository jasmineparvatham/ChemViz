import React from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip, Legend } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

export default function GroupedBar({ obj, title, color = "rgba(31, 60, 136, 0.9)" }) {
  if (!obj) return null;

  const labels = Object.keys(obj);
  const values = Object.values(obj).map((v) => Number(v));

  const data = {
    labels,
    datasets: [
      {
        label: title,
        data: values,
        backgroundColor: color,
        borderColor: color,
        borderWidth: 1,
        borderRadius: 8,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: { legend: { position: "bottom" } },
    scales: {
      x: { grid: { display: false }, ticks: { maxRotation: 35, minRotation: 35 } },
      y: { grid: { color: "rgba(148, 163, 184, 0.25)" } },
    },
  };

  return <Bar data={data} options={options} />;
}
