# ChemViz – Chemical Equipment Analytics Platform

## Project Overview
ChemViz is a hybrid web and desktop application designed to process, analyze, and visualize chemical equipment datasets. Engineers often need to inspect equipment parameters across multiple datasets to identify trends, compare values, and generate reports efficiently. Managing and interpreting large volumes of equipment parameters (such as flowrate, pressure, and temperature) from CSV files can be error-prone and time-consuming. ChemViz automates this data pipeline, providing statistical analysis and visual reports. 

A hybrid approach was implemented to provide flexibility: a web client for accessible cloud usage, and a desktop client for native execution, both powered by a single centralized REST API.

## Features
- **CSV Data Processing**: Upload, validate, and parse chemical equipment data via Pandas.
- **Statistical Summaries**: Automated calculation of averages, distributions, and dataset metrics.
- **Data Visualization**: Interactive web charts (Chart.js) and native desktop plots (Matplotlib).
- **Dataset History**: Persistent storage and management of past uploaded datasets.
- **Authentication**: JWT-based authentication for user accounts and dataset history management.
- **Report Generation**: Automated PDF and CSV summary report downloads.
- **Shared Backend**: A single Django REST API serving both React and PyQt5 clients seamlessly.

## System Architecture

React Web Application
        |
PyQt5 Desktop Application
        |
        ↓
Django REST API Backend
        |
        ↓
Analytics Processing + Database

**Data Flow:**
CSV upload → validation → Pandas processing → analytics generation → visualization/report generation

## How It Works
1. User uploads a chemical equipment CSV dataset.
2. Django backend validates and processes the uploaded data.
3. Pandas-based analytics modules generate statistical summaries.
4. Results are returned through REST APIs.
5. Web and desktop clients visualize the processed data and generate reports.

## Technology Stack
| Layer | Technology | Purpose |
|-------|------------|---------|
| **Backend** | Django REST Framework | Centralized API routing and business logic |
| **Data Processing** | Pandas | CSV parsing and statistical analytics |
| **Database** | SQLite | User and dataset metadata storage |
| **Web Frontend** | React, Material UI, Vite | Component-driven responsive web UI |
| **Web Charts** | Chart.js | Interactive browser-based visualization |
| **Desktop App** | PyQt5, Matplotlib | Native desktop UI and rendering |
| **Authentication**| JWT | Secure API access control |
| **API Communication** | REST APIs, Axios, HTTP Requests | Client-server communication |

## Demo
**Demo Video:**
https://drive.google.com/drive/folders/19KJ9whxYh9rVfueAZoyf_4ZXoayXUNzO?usp=sharing

## Live Deployment

**Application:**
https://chemviz-fossee-junnu.netlify.app/

*Powered by a deployed Django REST backend.*

## Local Setup

### Backend (Django)
```bash
cd backend
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run migrations and start server
python manage.py migrate
python manage.py runserver
```

### Web Frontend (React)
```bash
cd web
npm install
npm run dev
```

### Desktop Application (PyQt5)
```bash
cd desktop
pip install -r requirements.txt
python main.py
```
*A sample file (`sample_equipment_data.csv`) is included in the repository root for testing.*

## Repository Structure
- `backend/` - Django REST API and analytics processing
- `web/` - React frontend
- `desktop/` - PyQt5 desktop client

## Engineering Highlights
- Designed a shared REST API used by two different clients
- Separated analytics logic from API handling
- Implemented reusable visualization workflows
- Added authentication and dataset management
- Built report generation functionality
