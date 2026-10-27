# SmartFit - Python Health & Biometrics Engine

This directory contains the complete Python rewrite and implementation of the **BMI Calculation** and **Biometric Measurements** modules for the SmartFit Capstone Project.

---

## 📁 Files Included

| File | Description |
| :--- | :--- |
| `bmi_calculator.py` | Full BMI calculation engine (Metric & Imperial), healthy weight ranges, classifications, and clinical guidance. |
| `measurements.py` | Biometrics engine: Mifflin-St Jeor BMR, activity-based TDEE, goal-oriented calorie targets, hydration calculation, and clinical condition advisories. |
| `server.py` | Zero-dependency REST API server using Python's standard library (`http.server`). Exposes `/api/bmi` and `/api/measurements`. |
| `main.py` | Interactive command-line (CLI) application for demonstration and testing. |

---

## 🚀 How to Run

### 1. Interactive Terminal CLI
```bash
python python/main.py
```
Allows testing calculations interactively and running verification tests.

### 2. Standalone Verification
```bash
python python/bmi_calculator.py
python python/measurements.py
```

### 3. Run the Microservice API Server
```bash
python python/server.py
```
Starts a local REST API on `http://localhost:8000`:
- **POST `/api/bmi`**: Calculate BMI with metric or imperial parameters
- **POST `/api/measurements`**: Calculate complete metabolic profile (BMR, TDEE, Calories, Water, Condition tips)
- **GET `/health`**: Service status check
