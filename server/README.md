# Options Engine -> Server

Express backend API for the Options Engine project.

## Overview

This server provides API endpoints for:

- user registration, login, and profile retrieval
- protected calculation storage and history
- sample stock data serving
- options pricing via Black-Scholes, Greeks, and Monte Carlo

## Architecture

- `index.js` -> app entry point and route mounting
- `config/db.js` -> MongoDB connection helper
- `models/` -> Mongoose schemas for `User`, `Stock`, and `Calculation`
- `controllers/` -> route business logic
- `routes/` -> Express routers by feature
- `middleware/` -> auth protection and error handling
- `seed/seedStocks.js` -> sample stock seeding script

## Installation

```powershell
cd server
npm install
```

## Environment

Create a `.env` file in `server/` with the following values:

```env
PORT=5000
MONGO_URI=your_mongo_connection_string
JWT_SECRET=your_secret_key
JWT_EXPIRE=7d
```

## Run

Start the server:

```powershell
npm run dev
```

Or run production:

```powershell
npm start
```

## Seed Data

Seed the sample stock list:

```powershell
node seed/seedStocks.js
```

## API Endpoints

### Auth

- `POST /api/auth/register`
  - body: `{ name, email, password }`
  - returns: user profile and JWT token
- `POST /api/auth/login`
  - body: `{ email, password }`
  - returns: user profile and JWT token
- `GET /api/auth/me`
  - protected, returns authenticated user profile

### Pricing

- `POST /api/price/calculate`
  - protected
  - body: `{ stockSymbol, spotPrice, strikePrice, timeToExpiry, volatility, riskFreeRate, optionType }`
  - returns: Black-Scholes price, Greeks, Monte Carlo price, saved calculation metadata

### History

- `GET /api/history` -> protected, returns user calculation history
- `GET /api/history/:id` -> protected, returns specific calculation
- `DELETE /api/history/:id` -> protected, deletes specific calculation

### Stocks

- `GET /api/stocks/samples` -> protected, returns seeded stock list
- `GET /api/stocks/samples/:symbol` -> protected, returns details for a symbol

## Auth Middleware

- Checks `Authorization: Bearer <token>` header
- Verifies JWT using `JWT_SECRET`
- Attaches `req.user` from the database

## Pricing Engines

- `engine/blackScholes.js` -> Black-Scholes call/put pricing
- `engine/greeks.js` -> Delta, Gamma, Theta, Vega, Rho calculations
- `engine/monteCarlo.js` -> Monte Carlo simulation with 10,000 paths and standard error

## Notes

- User passwords are hashed with `bcryptjs`
- Calculation records store both input parameters and results
- MongoDB must be available before starting the server
- The client expects server API root at `http://localhost:5000/api`
