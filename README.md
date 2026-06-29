# Ω Options Pricing Engine

> A production-grade financial derivatives calculator built from scratch — Black-Scholes, all 5 Greeks, and Monte Carlo simulation — with zero external math libraries.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-options--engine-ED9E59?style=flat-square)](https://options-engine-red.vercel.app)

![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=flat-square&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-4.x-000000?style=flat-square&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=flat-square&logo=mongodb&logoColor=white)
![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-5.x-646CFF?style=flat-square&logo=vite&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-Auth-000000?style=flat-square&logo=jsonwebtokens&logoColor=white)

---

## 🧮 What Is This?

Options pricing is one of the most mathematically intensive problems in finance. Every trading desk, hedge fund, and fintech platform runs some version of this math in production.

This project implements three industry-standard pricing models **entirely from scratch in pure JavaScript** — no NumPy, no math.js, no external computation libraries:

| Model | Description |
|-------|-------------|
| **Black-Scholes** | Closed-form Nobel Prize-winning formula for instant exact pricing |
| **All 5 Greeks** | Delta, Gamma, Theta, Vega, Rho — complete risk sensitivity suite |
| **Monte Carlo** | 10,000-path Geometric Brownian Motion simulation with standard error |

---

## ✨ Features

- **Three pricing engines** firing simultaneously on every calculation
- **JWT authentication** — register, login, personal calculation history
- **Indian stock sample data** — RELIANCE, TCS, INFY, NIFTY50, HDFCBANK pre-seeded
- **Full calculation history** — save, view, expand, and delete past results
- **Learn page** — 7-section beginner guide explaining options from scratch
- **Interactive scenarios** — real-world examples (Bull, Bear, Hedge)
- **Monte Carlo path visualization** — see simulated stock paths rendered live
- **Minimal dark UI** — warm cosmic palette, DM Mono + Syne typography
- **REST API** — clean, documented endpoints for all features

---

## 🏗️ Architecture

```
Client (React + Vite)
        ↓  REST API
Server (Node.js + Express)
        ├── Auth Layer          JWT middleware
        ├── Math Engine         Pure JS — no external libraries
        │     ├── blackScholes.js   Abramowitz & Stegun Normal CDF
        │     ├── greeks.js         Partial derivatives of BS formula
        │     └── monteCarlo.js     Box-Muller + Geometric Brownian Motion
        └── Data Layer          MongoDB + Mongoose
              ├── Users
              ├── Calculations
              └── Stocks (seeded)
```

---

## 📁 Project Structure

```
options-engine/
├── server/
│   ├── config/
│   │   └── db.js                  MongoDB connection
│   ├── models/
│   │   ├── User.js
│   │   ├── Calculation.js
│   │   └── Stock.js
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── pricing.routes.js
│   │   ├── history.routes.js
│   │   └── stock.routes.js
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── pricing.controller.js
│   │   ├── history.controller.js
│   │   └── stock.controller.js
│   ├── engine/                    ← The math core
│   │   ├── blackScholes.js
│   │   ├── greeks.js
│   │   └── monteCarlo.js
│   ├── middleware/
│   │   ├── auth.middleware.js
│   │   └── error.middleware.js
│   ├── seed/
│   │   └── seedStocks.js
│   └── index.js
└── client/
    └── src/
        ├── pages/
        │   ├── Home.jsx
        │   ├── Learn.jsx
        │   ├── Dashboard.jsx
        │   └── History.jsx
        ├── components/
        │   ├── Navbar.jsx
        │   └── ProtectedRoute.jsx
        ├── context/
        │   └── AuthContext.jsx
        └── api/
            └── axios.js
```

---

## 🔌 API Reference

### Auth
```
POST   /api/auth/register     Register new user
POST   /api/auth/login        Login → returns JWT
GET    /api/auth/me           Get current user (protected)
```

### Pricing
```
POST   /api/price/calculate   Run all 3 engines (protected)
```

**Request body:**
```json
{
  "stockSymbol": "RELIANCE",
  "spotPrice": 2450,
  "strikePrice": 2500,
  "timeToExpiry": 0.25,
  "volatility": 0.28,
  "riskFreeRate": 0.065,
  "optionType": "call"
}
```

**Response:**
```json
{
  "stockSymbol": "RELIANCE",
  "inputs": { "...": "..." },
  "results": {
    "blackScholes": {
      "price": 132.1994,
      "d1": 0.041766,
      "d2": -0.098234
    },
    "greeks": {
      "delta": 0.516658,
      "gamma": 0.001162,
      "theta": -0.951015,
      "vega": 4.882782,
      "rho": 2.834029
    },
    "monteCarlo": {
      "price": 133.9132,
      "simulations": 10000,
      "standardError": 2.167834
    }
  }
}
```

### History
```
GET    /api/history           All calculations for user (protected)
GET    /api/history/:id       Single calculation (protected)
DELETE /api/history/:id       Delete calculation (protected)
```

### Stocks
```
GET    /api/stocks/samples          All sample stocks (protected)
GET    /api/stocks/samples/:symbol  Single stock by symbol (protected)
```

---

## ⚙️ Math Implementation Details

### Black-Scholes

The core formula:

```
Call = S × N(d1) − K × e^(−rT) × N(d2)
Put  = K × e^(−rT) × N(−d2) − S × N(−d1)

d1 = [ln(S/K) + (r + σ²/2) × T] / (σ√T)
d2 = d1 − σ√T
```

Normal CDF `N()` implemented via **Abramowitz & Stegun** polynomial approximation — accurate to 7 decimal places, no library required.

### The 5 Greeks

| Greek | Formula | Meaning |
|-------|---------|---------|
| **Delta (Δ)** | ∂C/∂S = N(d1) | Price sensitivity to stock move |
| **Gamma (Γ)** | ∂²C/∂S² = φ(d1)/(Sσ√T) | Delta sensitivity to stock move |
| **Theta (Θ)** | −∂C/∂T ÷ 365 | Daily time decay |
| **Vega (ν)** | ∂C/∂σ ÷ 100 | Sensitivity to 1% volatility change |
| **Rho (ρ)** | ∂C/∂r ÷ 100 | Sensitivity to 1% rate change |

### Monte Carlo

Uses **Geometric Brownian Motion**:

```
S_T = S × exp((r − σ²/2) × T + σ√T × Z)

Where Z ~ N(0,1) generated via Box-Muller transform:
Z = √(−2 ln U1) × cos(2π U2)
```

10,000 paths simulated, payoffs averaged and discounted to present value. Standard error reported for statistical confidence.

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- MongoDB Atlas account (free tier works)

### Installation

```bash
# Clone the repo
git clone https://github.com/Shivansh-04/options-engine.git
cd options-engine

# Install server dependencies
cd server
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret

# Seed sample Indian stocks
node seed/seedStocks.js

# Start the server
npm run dev
```

```bash
# In a new terminal — install and run client
cd client
npm install
npm run dev
```

Open `http://localhost:5173`

### Environment Variables

```env
PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_super_secret_key
JWT_EXPIRE=7d
```

---

## 🌱 Sample Data

Five Indian stocks pre-seeded for demo purposes:

| Symbol | Name | Price | Volatility | Sector |
|--------|------|-------|------------|--------|
| RELIANCE | Reliance Industries | ₹2,450 | 28% | Energy |
| TCS | Tata Consultancy Services | ₹3,800 | 22% | IT |
| INFY | Infosys Ltd | ₹1,450 | 25% | IT |
| NIFTY50 | Nifty 50 Index | ₹19,500 | 18% | Index |
| HDFCBANK | HDFC Bank | ₹1,620 | 20% | Banking |

Risk-free rate set to **6.5%** (India 10-year government bond).

---

## 🛣️ Roadmap

- [ ] Payoff diagram — interactive P&L chart at expiry
- [ ] Greeks vs Spot Price — line charts showing sensitivity curves
- [ ] Option Chain Table — all strikes, both calls and puts
- [ ] Break-even price calculator
- [ ] Compare across multiple stocks simultaneously
- [ ] Volatility smile visualization
- [ ] Export calculation as PDF

---

## 🧠 What I Learned Building This

- Implementing numerical methods (Normal CDF, Box-Muller) from scratch in JavaScript
- How financial derivatives actually work mathematically
- Why Monte Carlo and Black-Scholes converge to the same answer
- Building stateful REST APIs with proper auth and data ownership
- Designing UIs that make complex math readable

---

## 📄 License

MIT — use it, learn from it, build on it.

---

<div align="center">
  Built with pure mathematics · No external math libraries · 10,000 simulations per calculation
  <br /><br />
  <strong>Ω Options Engine</strong> — by <a href="https://github.com/Shivansh-04">Shivansh Gupta</a>
</div>
```
