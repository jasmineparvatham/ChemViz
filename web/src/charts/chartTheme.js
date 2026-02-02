export const chartColors = {
  blue: "rgba(31, 60, 136, 0.85)",
  teal: "rgba(46, 196, 182, 0.85)",
  orange: "rgba(245, 158, 11, 0.85)",
  purple: "rgba(139, 92, 246, 0.85)",
  red: "rgba(239, 68, 68, 0.85)",
};

export const baseOptions = (title) => ({
  responsive: true,
  plugins: {
    legend: { display: true, position: "bottom" },
    title: { display: !!title, text: title },
    tooltip: { enabled: true },
  },
  scales: {
    x: { grid: { display: false } },
    y: { grid: { display: true } },
  },
});
