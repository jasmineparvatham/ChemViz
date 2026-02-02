import React from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip, Legend } from "chart.js";
import { chartColors, baseOptions } from "./chartTheme";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

function binLabels(edges) {
  // edges length = bins+1
  const labels = [];
  for (let i = 0; i < edges.length - 1; i++) {
    labels.push(`${edges[i].toFixed(1)}–${edges[i + 1].toFixed(1)}`);
  }
  return labels;
}

export default function HistogramBar({ hist, title }) {
  if (!hist || !hist.bins || hist.bins.length < 2) return null;

  const labels = binLabels(hist.bins);
  const data = {
    labels,
    datasets:  [{
  label: title,
  data: hist.counts,
  backgroundColor: title.toLowerCase().includes("pressure")
    ? chartColors.orange
    : title.toLowerCase().includes("temperature")
      ? chartColors.red
      : chartColors.teal,
  borderRadius: 8,
}]
  };

  return <Bar data={data} options={baseOptions()}/>;
}
