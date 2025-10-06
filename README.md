# Project Airflow

**Project Airflow** is a web-based, predictive air quality application leveraging high-resolution data from NASA’s **Tropospheric Emissions: Monitoring of Pollution (TEMPO)** mission.  
The app provides actionable, neighborhood-level, hourly air quality forecasts across North America.

---

## 🚀 Project Overview

Project Airflow features a seamless, multi-persona user interface built around three core components:

- **Dashboard:** A data-fused interface showing real-time and historical air quality.  
- **Hourly Forecast Map:** Interactive map with a **“Time-Travel” slider** to visualize pollution plumes hour by hour.  
- **Health-First Alert System:** Sends actionable alerts, like *“Limit outdoor exertion at 4 PM,”* based on predictive modeling.

The **Data Integration Engine** is the core innovation, fusing TEMPO’s satellite data (NO₂, O₃) with ground-based sensor readings and weather forecasts to provide validated, neighborhood-level predictions.

---

## 🎯 Challenge Addressed

Project Airflow is an app that:

- Delivers validated, neighborhood-level, hourly air quality predictions.  
- Visualizes pollution spread hour-by-hour using TEMPO’s geospatial advantage.  
- Provides actionable insights for sensitive populations and outdoor enthusiasts to reduce pollutant exposure.

---

## 💡 Why It Matters

By translating complex, high-volume NASA data into simple advice, Project Airflow empowers users to:

- Schedule outdoor activities safely.  
- Reduce exposure to harmful pollutants for sensitive groups (e.g., children with asthma, elderly).  
- Make informed public health decisions based on predictive, validated data.

---

## 🛠️ Technologies Used

- **Frontend:** Next.js (React), HTML, CSS, JavaScript  
- **Backend:** FastAPI (Python)  
- **Data Sources:**  
  - [NASA TEMPO Mission](https://science.nasa.gov/mission/tempo/) — satellite data for air pollutant levels (NO₂, O₃).  
  - [OpenWeatherMap API](https://openweathermap.org) — weather and atmospheric conditions for model validation.  
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

- **Sarah Chen:** Parent of a child with asthma or respiratory sensitivities.  
- **Marcus Jackson:** Outdoor enthusiast planning safe activities.  
- **General Public:** Anyone interested in real-time, neighborhood-level air quality forecasts.

---

## 📈 Future Improvements

- Include predictive models for additional pollutants (PM2.5, CO).  
- Add mobile app support for on-the-go alerts.  
- Expand coverage beyond North America.  

---

## 🏃‍♂️ Getting Started

### Prerequisites

Before running the project, make sure you have the following installed:

- **Node.js & npm** — required for the frontend.  
  👉 [Download & Install Node.js](https://nodejs.org/)  
- **Python 3** — required for the backend.  
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

*Project Airflow turns complex NASA data into actionable guidance, helping communities breathe easier and make smarter outdoor decisions.*
