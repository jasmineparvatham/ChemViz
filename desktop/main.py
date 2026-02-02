import sys
import csv

from PyQt5.QtWidgets import (
    QApplication, QMainWindow, QWidget,
    QPushButton, QFileDialog, QLabel,
    QVBoxLayout, QTabWidget, QTableWidget,
    QTableWidgetItem, QTextEdit, QMessageBox
)

from api import ChemVizAPI
from charts import MplCanvas, plot_bar, plot_hist


class ChemVizApp(QMainWindow):
    def __init__(self):
        super().__init__()
        self.setWindowTitle("ChemViz Desktop")
        self.resize(1000, 700)

        self.api = ChemVizAPI()

        root = QWidget()
        self.setCentralWidget(root)
        layout = QVBoxLayout(root)

        # Upload button
        self.upload_btn = QPushButton("Upload CSV")
        self.upload_btn.clicked.connect(self.upload_csv)
        layout.addWidget(self.upload_btn)

        # Summary text
        self.summary = QTextEdit()
        self.summary.setReadOnly(True)
        layout.addWidget(self.summary)

        # Tabs
        tabs = QTabWidget()
        layout.addWidget(tabs)

        # Table tab
        self.table = QTableWidget()
        tabs.addTab(self.table, "Table")

        # Charts
        self.canvas_type = MplCanvas()
        self.canvas_flow = MplCanvas()
        tabs.addTab(self.canvas_type, "Type Distribution")
        tabs.addTab(self.canvas_flow, "Flowrate Histogram")

    def upload_csv(self):
        path, _ = QFileDialog.getOpenFileName(self, "Select CSV", "", "CSV Files (*.csv)")
        if not path:
            return

        try:
            report = self.api.upload_csv(path)
            self.show_summary(report)
            self.load_table(path)
            self.draw_charts(report)
        except Exception as e:
            QMessageBox.critical(self, "Upload Failed", str(e))

    def show_summary(self, r):
        text = (
            f"Total Equipment: {r['total_equipment']}\n"
            f"Avg Flowrate: {r['avg_flowrate']}\n"
            f"Avg Pressure: {r['avg_pressure']}\n"
            f"Avg Temperature: {r['avg_temperature']}"
        )
        self.summary.setText(text)

    def load_table(self, path):
        with open(path, newline="") as f:
            reader = csv.reader(f)
            rows = list(reader)

        header = rows[0]
        data = rows[1:20]

        self.table.setRowCount(len(data))
        self.table.setColumnCount(len(header))
        self.table.setHorizontalHeaderLabels(header)

        for i, row in enumerate(data):
            for j, val in enumerate(row):
                self.table.setItem(i, j, QTableWidgetItem(val))

    def draw_charts(self, r):
        plot_bar(self.canvas_type.ax, r["equipment_distribution"], "Equipment Types")
        self.canvas_type.draw()

        hist = r["analytics"]["histograms"]["flowrate"]
        plot_hist(self.canvas_flow.ax, hist, "Flowrate Histogram")
        self.canvas_flow.draw()


if __name__ == "__main__":
    app = QApplication(sys.argv)
    window = ChemVizApp()
    window.show()
    sys.exit(app.exec_())
