# freelance-contracts-ai
Collaborative contract management app with inline annotations, AI clause summaries, full-text search, and PDF uploads — built on a modern React + Node + Postgres stack with testing, CI, Docker, and cloud deploys.

---

## Planning Docs
- [User Stories](./USER_STORIES.md)
- [Database Schema](./SCHEMA.md)

---

**Live API:** https://freelance-contracts-ai-production.up.railway.app  
**Stack:** React (Vite) · Node.js (Express) · PostgreSQL (Prisma) · Jest/RTL · Supertest · Docker · GitHub Actions CI/CD · Railway · AWS S3 · OpenAI

---

## Features

- **Auth** — JWT signup/login, protected client routes  
- **Contracts** — CRUD, inline annotations (add/edit/delete)  
- **AI summaries** — send a clause → store GPT summary per contract  
- **Search** — Postgres full-text (tsvector) across your contracts  
- **Uploads** — PDF → S3, URL saved to Postgres and shown as “Download PDF”  
- **Testing** — backend (Jest + Supertest), frontend (Jest + RTL)  
- **Ops** — Dockerized backend & DB, GitHub Actions CI, Railway deploy

---

## Quickstart (Local)

### 0) Prereqs
- Node 18+ and npm  
- Docker Desktop (for Postgres and/or running the API in a container)

### 1) Clone
```bash
git clone https://github.com/<your-username>/freelance-contracts-ai.git
cd freelance-contracts-ai

