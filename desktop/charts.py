from matplotlib.backends.backend_qtagg import FigureCanvasQTAgg as FigureCanvas
from matplotlib.figure import Figure

class MplCanvas(FigureCanvas):
    def __init__(self, width=5, height=3, dpi=100):
        self.fig = Figure(figsize=(width, height), dpi=dpi)
        self.ax = self.fig.add_subplot(111)
        super().__init__(self.fig)

def plot_bar(ax, data, title):
    ax.clear()
    labels = list(data.keys())
    values = list(data.values())
    ax.bar(labels, values)
    ax.set_title(title)
    ax.tick_params(axis="x", rotation=30)

def plot_hist(ax, hist, title):
    ax.clear()
    bins = hist.get("bins", [])
    counts = hist.get("counts", [])

    if len(bins) < 2:
        ax.set_title("No data")
        return

    centers = [(bins[i] + bins[i+1]) / 2 for i in range(len(bins)-1)]
    widths = [bins[i+1] - bins[i] for i in range(len(bins)-1)]

    ax.bar(centers, counts, width=widths)
    ax.set_title(title)
