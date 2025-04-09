
# 🌱 Greenhouse Observer – IoT Project (2025 Exam)

> A low-cost, real-time environmental monitoring system for greenhouses using IoT, Web, and Cloud technologies.

---

## 📘 Overview

In greenhouse environments, maintaining optimal conditions such as **temperature**, **air quality**, and **light levels** is critical for plant growth and sustainability. Traditional monitoring systems are often expensive or complex.  
This project provides an affordable and easy-to-use solution built on the **ESP32**, enabling real-time environmental monitoring and data-driven greenhouse optimization.

Developed by **Tymon & Kyle** as part of the **4th Semester IoT Exam Project (2025)**.

---

## 🔧 Features

- 🌡️ Real-time temperature, light, and gas monitoring
- 📊 Live frontend dashboard with WebSocket updates
- 🔄 MQTT messaging via Flespi middleware
- 🧅 Clean backend with .NET & Onion Architecture
- ☁️ Fully distributed cloud hosting (Firebase, Pebble, Aiven)
- 💬 Protocols: MQTT, HTTPS, WebSocket, TCP/IP

---

## 🧠 System Architecture

### 🕸️ Network Diagram Highlights

| Component | Description |
|----------|-------------|
| **ESP32** | Connects to sensors and sends real-time data via MQTT |
| **Flespi** | Middleware broker for secure, decoupled MQTT communication |
| **Backend (.NET)** | Contains a Listener for MQTT, an API layer, and WebSocket support |
| **Frontend (Firebase)** | React/JS-based UI with real-time sensor visualizations |
| **Database (Aiven)** | Stores historical sensor data for analysis |

#### ⚙️ Protocol Mix

- **MQTT** → Lightweight messaging for IoT
- **WebSocket** → Real-time UI updates
- **HTTPS** → API interactions
- **TCP/IP** → DB communications

---

## 🧪 Hardware Setup

### Components Used:

- **ESP32 Microcontroller**
- **DS18B20** – Digital temperature sensor
- **Flying Fish MQ Sensor** – Gas detection (smoke, CO, LPG)
- **LDR** – Light sensor (analog)
- **Breadboard + Jumper Wires + Resistors**

### Sensor Connections:

| Sensor | Type | Pin Type |
|--------|------|----------|
| DS18B20 | Digital | Digital I/O |
| MQ Sensor | Analog | Analog |
| LDR | Analog | Analog |

---

## 🧱 Backend Structure – Onion Architecture

- **Core Layer**: Business logic & domain models
- **Infrastructure Layer**: MQTT, DB, external APIs
- **API Layer**: REST + WebSocket endpoints
- **Listener Module**: Separates real-time ingestion from core logic

---

## 🌐 Hosting & DevOps

| Component | Hosting Provider |
|----------|-------------------|
| Frontend | **Firebase** |
| Backend | **Pebble** |
| Database | **Aiven** |

Using distributed hosting improves flexibility but requires coordinated **DevOps** practices for deployment, CI/CD, and monitoring.

---

## 📈 Benefits

- Real-time monitoring improves response time to environmental changes.
- Scalable architecture supports future sensor/device expansion.
- Clean separation of concerns enhances maintainability.
- Low-latency data delivery boosts user interaction and decision-making.

---

<!-- ## 🚀 Future Improvements

- Add historical data graphs
- Mobile-responsive frontend
- Add automatic alerts (e.g., high temp/gas detection)
- Integrate actuator support for greenhouse control (e.g., fans/lights)

--- -->

## 🤝 Authors

**Tymon & Kyle**  
*Fourth Semester IoT Project – 2025*
