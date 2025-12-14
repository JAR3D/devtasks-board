# DevTasks Board

A simple full-stack task board for developers, built with:

- Next.js (App Router, TypeScript)
- MongoDB (via Mongoose)
- React hooks + basic state management
- REST-style API routes under `/api/tasks`

## Features

- Create, list and manage tasks
- Columns by status: Backlog, In Progress, Done
- Filter by status and priority
- Text search on title/description

## Tech Stack

- Next.js
- TypeScript
- React
- MongoDB + Mongoose
- (Planned) Jest tests for API and components

## Getting Started

```bash
pnpm install
cp .env.example .env.local  # and set MONGODB_URI
pnpm dev
