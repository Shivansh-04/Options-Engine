# Options Engine -> Client

React frontend for the Options Engine project.

## Overview

This client is a Vite-powered React app that provides:

- Authentication with registration and login
- Protected dashboard and history screens
- Option pricing calculator using backend pricing engines
- Educational Learn page and sample stock quick-select

## Architecture

- `src/main.jsx` -> app entry point
- `src/App.jsx` -> route definitions
- `src/api/axios.js` -> axios instance with base URL and JWT interceptor
- `src/context/AuthContext.jsx` -> auth state, login/register/logout
- `src/components/` -> reusable UI and protection components
- `src/pages/` -> all page screens

## Pages

- `/` -> Home landing page
- `/learn` -> options education page
- `/login` -> user sign in
- `/register` -> user sign up
- `/dashboard` -> pricing calculator (protected)
- `/history` -> saved calculations (protected)

## Installation

```powershell
cd client
npm install
```

## Development

```powershell
npm run dev
```

Open the local URL shown by Vite in your browser.

## Production

Build production files:

```powershell
npm run build
```

Preview the production build:

```powershell
npm run preview
```

## Backend Connection

The frontend expects the API at `http://localhost:5000/api`.

If your server runs on a different host or port, update `src/api/axios.js` accordingly.

## Authentication

- `register()` calls `/api/auth/register`
- `login()` calls `/api/auth/login`
- JWT token is stored in `localStorage`
- `AuthContext` exposes `user`, `loading`, `error`, `register`, `login`, `logout`
- Protected routes redirect to login when unauthenticated

## Notes

- API errors show on login/register and calculator pages
- 401 responses clear auth state and redirect to `/login`
- Sample stocks are fetched from `/api/stocks/samples`
- Calculations are posted to `/api/price/calculate`
