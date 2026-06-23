# Options Engine

A full-stack options pricing application built with React, Vite, Express, and MongoDB.

## Overview

This workspace contains two separate projects:

- `client/` — React frontend with authentication, options calculator, history, and educational pages.
- `server/` — Express API with JWT auth, sample stock data, Black-Scholes pricing, Greek calculations, and Monte Carlo simulation.

## Features

- User registration and login with JWT authentication
- Protected calculator and history pages
- Black-Scholes pricing engine
- Greek risk sensitivities: Delta, Gamma, Theta, Vega, Rho
- Monte Carlo pricing simulation with standard error
- Persistent calculation history per user
- Sample stock list seeded from server
- Educational `Learn` page explaining options concepts

## Folder Structure

- `client/` — React application
- `server/` — Node API and database models

## Setup

### 1. Server

```powershell
cd server
npm install
```

Create a `.env` file in the `server/` folder with:

```env
PORT=5000
MONGO_URI=your_mongo_connection_string
JWT_SECRET=your_secret_key
JWT_EXPIRE=7d
```

Seed sample stocks:

```powershell
node seed/seedStocks.js
```

Start the server:

```powershell
npm run dev
```

### 2. Client

```powershell
cd ../client
npm install
npm run dev
```

Open the Vite development URL shown in the terminal.

## Running the App

1. Start the server at `http://localhost:5000`
2. Start the client and open the Vite URL (usually `http://localhost:5173`)
3. Register or login, then use the calculator and history pages

## Notes

- The frontend calls the API at `http://localhost:5000/api`
- Token-based auth is stored in `localStorage`
- The server protects calculation, history, and sample stock endpoints

## Further Reading

- See `client/README.md` for frontend-specific instructions
- See `server/README.md` for backend-specific setup and API details
