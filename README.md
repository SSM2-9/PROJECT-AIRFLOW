# Project Airflow

**Project Airflow** is a web-based, predictive air quality application leveraging high-resolution data from NASA’s **Tropospheric Emissions: Monitoring of Pollution (TEMPO)** mission.  
The app provides actionable, neighborhood-level, hourly-inspired air quality insights across North America.

---

## 🚀 Project Overview

Project Airflow features a seamless, multi-persona user interface built around three core components:

- **Dashboard:** Shows real-time pollutant data from **OpenWeatherMap** and provides actionable guidance for sensitive populations.  
- **Forecast Map:** Displays TEMPO satellite data for selected cities and date ranges. The map may take time to load and does not currently support hourly time-travel visualization.  
- **Health-First Alert System (Planned):** Alerts are not currently implemented, but actionable guidance is displayed on the dashboard.

The **Data Integration Engine** is the core innovation, fusing TEMPO satellite data (NO₂, O₃) with ground-based sensor readings and weather forecasts to provide validated neighborhood-level insights.

---

## 🎯 Challenge Addressed

Project Airflow is an app that:

- Provides neighborhood-level air quality insights using TEMPO and weather data.  
- Visualizes pollutant spread through the map for selected cities and date ranges.  
- Provides actionable guidance through the dashboard, helping sensitive populations and outdoor enthusiasts plan safer activities.

---

## 💡 Why It Matters

By translating complex NASA data into clear advice, Project Airflow empowers users to:

- Schedule outdoor activities safely.  
- Reduce exposure to harmful pollutants for sensitive groups (e.g., children with asthma, elderly).  
- Make informed public health decisions based on validated data.

---

## 🛠️ Technologies Used

- **Frontend:** Next.js (React), HTML, CSS, JavaScript  
- **Backend:** FastAPI (Python)  
- **Data Sources:**  
  - [NASA TEMPO Mission](https://science.nasa.gov/mission/tempo/) — satellite data for air pollutant levels (NO₂, O₃)  
  - [OpenWeatherMap API](https://openweathermap.org) — live pollutant levels for dashboard  
- **Deployment:** GitHub (source)

---

## 📂 Repository Structure

PROJECT-AIRFLOW/
├─ FRONTEND/ # User interface and visualization
├─ BACKEND/ # Data integration and processing engine
│ ├─ main.py
│ └─ requirements.txt
├─ data_cache/ # Cached data files (large files handled outside GitHub)
└─ README.md # Project documentation


---

## 👩‍💻 Target Users

- **Parents and caregivers** monitoring children with asthma or sensitivities  
- **Outdoor enthusiasts** planning safe activities  
- **General public** interested in neighborhood-level pollutant trends  

---

## 📈 Future Improvements

- Add **time-travel slider** for hourly TEMPO forecasts.  
- Implement **Health-First Alerts** for high-risk periods.  
- Include predictive models for additional pollutants (PM2.5, CO).  
- Add mobile app support for on-the-go alerts.  
- Expand coverage beyond North America.  

---

## 🏃‍♂️ Getting Started

### Prerequisites

Before running the project, make sure you have the following installed:

- **Node.js & npm** — required for the frontend  
  👉 [Download & Install Node.js](https://nodejs.org/)  
- **Python 3** — required for the backend  
  👉 [Download & Install Python](https://www.python.org/downloads/)  
- **Git** *(optional, for cloning the repository)*  
  👉 [Install Git](https://git-scm.com/)

---

### 🔑 API Keys & Environment Setup

To fetch live data, you need valid API credentials:

- **OpenWeatherMap API:** Sign up at [https://openweathermap.org](https://openweathermap.org) to get your API key.  
  - In your project, create a `.env.local` file inside the `FRONTEND/` folder with:
    ```
    OPENWEATHER_API_KEY=your_openweathermap_key
    ```
  - Next.js will automatically load this key as an environment variable in the frontend.

- **NASA TEMPO (Earthdata):** Register at [https://urs.earthdata.nasa.gov](https://urs.earthdata.nasa.gov) to get a username and password.  
  - The backend will prompt for login automatically the first time you run it via `earthaccess`. Credentials are saved locally for future use.  
  - No `.env` file is required for NASA TEMPO.

> **Important:** Make sure `.env.local` is included in `.gitignore` so your OpenWeatherMap API key isn’t uploaded to GitHub.

The app will still run using cached data in the `data_cache/` folder if you don’t have API keys.

---

### How to Run

1. **Clone the repository**
    ```bash
    git clone https://github.com/SSM2-9/PROJECT-AIRFLOW.git
    cd PROJECT-AIRFLOW
    ```

2. **Run the Backend**
    ```bash
    cd BACKEND
    python3 -m venv venv
    source venv/bin/activate  # On Windows: venv\Scripts\activate
    pip install -r requirements.txt
    uvicorn main:app --reload
    ```

3. **Run the Frontend**
   Open another terminal
    ```bash
    cd FRONTEND
    npm install
    npm run dev
    ```

4. **View the App**
    - Open your browser and go to 👉 `http://localhost:3000`

---

## 🔗 GitHub Repository

[🔗 Project Airflow on GitHub](https://github.com/SSM2-9/PROJECT-AIRFLOW)

---

*Project Airflow translates NASA TEMPO data and OpenWeatherMap pollutant information into actionable public health insights, helping communities make safer outdoor decisions. Features like time-travel visualization and automated alerts are planned for future development.*

