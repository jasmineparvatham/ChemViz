# 🧪 ChemViz – Chemical Equipment Parameter Visualizer  
**Hybrid Web + Desktop Application**

---

## 📌 Project Overview

**ChemViz** is a hybrid **Web + Desktop application** designed to visualize and analyze chemical equipment data from CSV files.  
It allows users to upload datasets containing equipment parameters such as **flowrate, pressure, and temperature**, performs backend analytics, and presents insights through interactive charts and summaries.

A **single Django REST backend** powers both:
- 🌐 a **React-based web application**
- 🖥️ a **PyQt5 desktop application**

This project was developed as part of an **Intern Screening Task**, with several additional features and strong backend design beyond the base requirements.

---

## 🚀 Key Features

### 🔹 CSV Upload & Processing
- Upload CSV files containing chemical equipment data
- Automatic validation and parsing using **Pandas**
- Works for both public and authenticated users

### 🔹 Backend Analytics (Django + DRF)
- Total equipment count
- Average flowrate, pressure, and temperature
- Equipment type distribution
- Advanced analytics:
  - Histograms
  - Boxplots
  - Correlation analysis
  - Grouped averages
  - Insight generation

### 🔹 Visualizations
- **Web**: Interactive charts using **Chart.js**
- **Desktop**: Native plots using **Matplotlib**
- Clean separation between analytics (backend) and visualization (frontend)

### 🔹 History & Dataset Management
- Uploaded datasets are stored with metadata
- Backend manages dataset storage efficiently
- Users can star/unstar important datasets
- Dataset history available for authenticated users

### 🔹 Reports & Exports
- 📄 Generate **PDF reports**
- 📊 Download **summary CSV files**
- Files served securely through backend APIs

### 🔹 Authentication
- JWT-based authentication
- Public mode for quick analysis
- Logged-in users get persistent history and dataset management

---

## 🛠 Tech Stack

| Layer | Technology | Purpose |
|-----|-----------|--------|
| Backend | Django + Django REST Framework | API & analytics |
| Data Processing | Pandas | CSV parsing & statistics |
| Database | SQLite | Dataset metadata storage |
| Web Frontend | React.js + MUI + Chart.js | Interactive UI |
| Desktop Frontend | PyQt5 + Matplotlib | Native desktop UI |
| Authentication | JWT | Secure API access |
| Version Control | Git & GitHub | Source control |


---

## ⚙️ Setup Instructions

### 1️⃣ Backend Setup (Django)

```bash
cd backend
python -m venv venv
Activate virtual environment

Windows:

venv\Scripts\activate


macOS/Linux:

source venv/bin/activate


Install dependencies

pip install -r requirements.txt


Run migrations and server

python manage.py migrate
python manage.py runserver


Backend runs at:

http://127.0.0.1:8000/

2️⃣ Web Frontend Setup (React)
cd web
npm install
npm run dev


Web application runs at:

http://localhost:5173/

3️⃣ Desktop Application Setup (PyQt5)
cd desktop
pip install -r requirements.txt
python main.py


The desktop app connects to the same Django backend APIs.

📄 Sample CSV Format
Equipment Name,Type,Flowrate,Pressure,Temperature
Reactor A,Reactor,120.5,15.2,350
Pump X,Pump,80.0,5.5,90
Heat Exchanger 1,HeatExchanger,200.3,10.5,220


A sample file (sample_equipment_data.csv) is included for testing and demo purposes.



🌱 Future Enhancements

Enhanced UI/UX theming

OAuth-based authentication

Advanced comparative analytics

Cloud storage integration

👩‍💻 Author

Jasmine Parvatham
B.Tech – Information Technology 
2nd year
National Institue of Technology Karnataka,Surathkal
