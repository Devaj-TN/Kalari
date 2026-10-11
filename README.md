# Kalari — Kalaripayattu Academy Website

A premium marketing website for a Kalaripayattu training academy, built with React 18 + Vite + TypeScript + Tailwind CSS v4.

## Project Structure

```
kalari/
├── frontend/   # React + Vite app — active build target
└── backend/    # Reserved for future Laravel API (not scaffolded yet)
```

## Frontend

See [`frontend/README.md`](./frontend/README.md) for setup instructions.

### Quick Start

```bash
cd frontend
npm install
npm run dev
```

## Backend (Placeholder)

The `backend/` directory is reserved for a future **Laravel** REST API that will handle:
- Content management (programs, news, branches)
- Enrollment form submissions
- Authentication

> **Migration note:** When the Laravel backend is ready, the React hooks in `src/hooks/` are designed to swap from local data files to real API calls with a one-line change per hook. Long-term, evaluate migrating to **Laravel + Inertia.js** to gain server-side rendering for improved SEO.
