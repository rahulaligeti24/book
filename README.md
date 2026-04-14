# Book Recommendation Engine

A full-stack MERN web application for the project **"Designing a Book Recommendation Engine using MongoDB Aggregations"**.

## Stack

- Frontend: React + Vite + Tailwind CSS + Recharts
- Backend: Node.js + Express + MongoDB + Mongoose
- Auth: JWT

## Structure

```text
.
|-- client
|-- server
|-- .env.example
`-- README.md
```

## Features

- Content-based similar book recommendations
- Personalized unread recommendations from user preferences and reading history
- Analytics for popular books, top authors, and highest rated books
- JWT login/register
- Bookmark and rating actions

## Setup

1. Copy env values:

```bash
cp .env.example server/.env
cp client/.env.example client/.env
```

2. Install dependencies:

```bash
npm install --prefix server
npm install --prefix client
```

3. Seed the database:

```bash
npm run seed --prefix server
```

4. Start the backend and frontend in separate terminals:

```bash
npm run dev --prefix server
npm run dev --prefix client
```

## Seeded demo accounts

- `maya@example.com` / `password123`
- `arjun@example.com` / `password123`
- `zoe@example.com` / `password123`

## Main API routes

- `GET /api/books`
- `GET /api/books/:id`
- `GET /api/books/:id/similar`
- `POST /api/books/:id/rate`
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/users/:id/profile`
- `GET /api/users/:id/recommendations`
- `POST /api/users/:id/bookmarks/:bookId`
- `DELETE /api/users/:id/bookmarks/:bookId`
- `GET /api/analytics/popular-books`
- `GET /api/analytics/top-authors`
- `GET /api/analytics/highest-rated-books`

