# CareerVeda 2.0

Public marketing and application site for CareerVeda — a career guidance platform.

## Tech Stack

| Package | Tech | Port | Purpose |
|---|---|---|---|
| `careerveda-vite/` | Vite 8 + React 19 + Tailwind v4 + react-router v7 | 5173 | Public marketing & app site (15 pages) |
| `backend/` | Node.js + Express | 5000 | API server |
| `server/` | Node.js | — | Additional services |

## Getting Started

```bash
# Install dependencies
cd careerveda-vite && npm install
cd ../backend && npm install

# Run frontend + backend together
npm run dev

# Or run individually
npm run dev:fe   # Frontend only
npm run dev:be   # Backend only
```

## Features

- Role-based authentication (Firebase)
- Student dashboard
- Course catalog and career guidance
- Responsive design with Tailwind v4
