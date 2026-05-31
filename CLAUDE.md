# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Thi Uyển** — a modern Vietnamese poetry library (clone of thivien.net) with a *Modern East Asian Heritage* design aesthetic. The system manages 100k+ poems, authors, translations, annotations, a forum, and member-submitted content.

## Commands

### Backend (`cd backend`)
```bash
npm run start:dev        # dev server with hot reload
npm run build            # compile TypeScript → dist/
npm run start:prod       # run compiled build
npm run lint             # ESLint --fix
npm run test             # Jest (all *.spec.ts)
npm run test:watch       # Jest interactive watch
npm run test:cov         # coverage report

# TypeORM migrations
npm run migration:generate  # generate migration from entity diff
npm run migration:run       # apply pending migrations
npm run migration:revert    # roll back last migration
```

### Frontend (`cd frontend`)
```bash
npm run dev    # Next.js dev server on https://localhost:3000 (experimental HTTPS)
npm run build  # production build
npm run lint   # ESLint
```

## Architecture

### Stack
- **Frontend**: Next.js 16 (App Router) + React 19 + TypeScript + Tailwind CSS v4
- **Backend**: NestJS 10 + TypeORM + MySQL (`mysql2` driver)
- **State**: Zustand (persisted to localStorage as `thivien-store`) + TanStack Query for server data
- **Auth**: JWT (passport-jwt) + Facebook OAuth (passport-facebook); JWT is applied **globally** — every route is protected by default

### Port Map
| Service | Default port |
|---|---|
| Frontend (HTTPS) | 3000 |
| Backend API | 3001 |

The frontend reads `NEXT_PUBLIC_API_URL` (set to `http://localhost:3001/v1` in `.env.local`). The backend `API_PREFIX` defaults to `v1`, so all endpoints are under `/v1/`.

> **Note**: `backend/.env.example` shows PostgreSQL-style values (port 5432, `postgres` username) but the actual TypeORM config in `app.module.ts` and `data-source.ts` uses `type: 'mysql'`. Use MySQL/MariaDB, not PostgreSQL.

### Backend Structure
```
src/
  main.ts              # bootstrap — Swagger at /docs, global prefix /v1
  app.module.ts        # root module; wires all feature modules + global guards/interceptors
  data-source.ts       # TypeORM DataSource for CLI migrations
  entities/            # TypeORM entity classes (User, Author, Poem, PoemVersion, …)
  modules/             # feature modules: auth, authors, poems, translations, comments,
                       #   annotations, forum, bookmarks, countries, eras, poem-categories
  common/
    guards/            # JwtAuthGuard (global), LocalAuthGuard, RolesGuard
    decorators/        # @Public(), @Roles(), @CurrentUser()
    interceptors/      # TransformInterceptor — wraps all responses as { success, data, meta }
    filters/           # HttpExceptionFilter — standardised error shape
  migrations/          # timestamped migration files
```

Each feature module follows a strict NestJS pattern: `*.module.ts` → `*.controller.ts` → `*.service.ts` → `dto/*.dto.ts`.

**Global behaviour to know:**
- `JwtAuthGuard` is applied globally via `APP_GUARD`. Mark public routes with `@Public()`.
- `TransformInterceptor` wraps every response: `{ success: true, data: ... }`. If a service already returns an object with `success`, it passes through unchanged.
- Rate limiting: 100 requests / 60 seconds (ThrottlerModule).
- Swagger UI: `http://localhost:<PORT>/docs` (Bearer auth pre-configured).

### Frontend Structure
```
src/
  app/               # Next.js App Router pages (Vietnamese URL slugs)
    (auth)/          # dang-nhap, dang-ky, callback (route group, no shared layout segment)
    tac-gia/         # /tac-gia and /tac-gia/[slug]
    tho/             # /tho and /tho/[slug]
    dien-dan/        # /dien-dan and /dien-dan/[topic-slug]
    sang-tac/        # member poem editor + AI assistant
    tu-dien/         # Hán-Việt & allusion dictionary
    thong-ke/        # statistics
    search/          # search results
    ca-nhan/         # user profile
  components/
    layout/          # Header, Footer
    author/          # AuthorCard
    poem/            # PoemCard, ReaderToolbar
    home/            # HeroSearch
    ui/              # Badge (atomic UI primitives)
  lib/
    api.ts           # all API calls via axios (apiClient); attaches JWT from localStorage
    types.ts         # shared TypeScript interfaces
    utils.ts         # helpers
    queryClient.ts   # TanStack Query singleton
    mockData.ts      # static mock data for development
  providers/
    Providers.tsx    # QueryClientProvider + ThemeInitializer (wraps entire app)
  stores/
    useStore.ts      # Zustand store — theme, auth (user + token), reader preferences, recent searches
```

**Key conventions:**
- JWT token is stored in `localStorage` as `tv_token`; `apiClient` intercepts every request to attach it.
- Zustand store is persisted under key `thivien-store`. Auth state (`user`, `token`) lives here alongside reader UX preferences.
- Fonts: `--font-inter` (system UI) and `--font-lora` (poetry body); Noto Serif TC loaded for CJK characters.
- The dev server uses self-signed HTTPS certificates in `frontend/certificates/` (required for Facebook OAuth callbacks).

### Important Notes from `frontend/AGENTS.md`
This project uses **Next.js 16**, which has breaking changes from earlier versions. Before writing Next.js-specific code (routing, caching, data fetching patterns), consult `node_modules/next/dist/docs/` for the correct API in this version.
