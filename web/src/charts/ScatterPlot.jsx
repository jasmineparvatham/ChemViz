import React from "react";
import { Scatter } from "react-chartjs-2";
import { Chart as ChartJS, LinearScale, PointElement, Tooltip, Legend } from "chart.js";
ChartJS.register(LinearScale, PointElement, Tooltip, Legend);

export default function ScatterPlot({ points, title }) {
  // points = [{x, y}, ...]
  if (!points || points.length === 0) return null;

  const data = {
    datasets: [{ label: title, data: points }],
  };

  return <Scatter data={data} />;
}
