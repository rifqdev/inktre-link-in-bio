# Inktre

A modern platform to manage and share your important links in one place.

![Inktre Screenshot](./docs/image.png)


### Demo Video

<video src="https://github.com/rifqdev/inktre-link-in-bio/raw/main/docs/demo.mov" controls width="600" height="400"></video>

## Tech Stack

![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)
![NextAuth](https://img.shields.io/badge/NextAuth.js-5.0-000000?style=for-the-badge&logo=nextauth&logoColor=white)
![dnd-kit](https://img.shields.io/badge/%40dnd--kit-core-FF4D4D?style=for-the-badge&logo=react&logoColor=white)

## Table of Contents

- [Setup Instructions](#setup-instructions)
- [What Was Implemented](#what-was-implemented)
- [Time Breakdown](#time-breakdown)
- [Live Demo](#live-demo)

## Setup Instructions

### Prerequisites

- **Node.js** 18+ and **pnpm** installed
- **PostgreSQL** database running locally or accessible remotely
- Git for version control

### 1. Clone and Install Dependencies

```bash
# Install dependencies
pnpm install
```

### 2. Environment Setup

Create a `.env` file in the root directory (copy from `.env.example`):

```bash
cp .env.example .env
```

Update the environment variables with your values:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/linkinbio"

# NextAuth
NEXTAUTH_SECRET="your-secret-key-generate-with-openssl-rand-base64-32"
NEXTAUTH_URL="http://localhost:3000"

# App URL
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

**Generate NEXTAUTH_SECRET** (required):
```bash
openssl rand -base64 32
```

### 3. Database Setup

Run Prisma migrations to create the database schema:

```bash
# Generate Prisma client
pnpm prisma generate

# Run migrations
pnpm prisma migrate dev

```

### 4. Running the Application

Start the development server:

```bash
pnpm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Build for Production

```bash
# Build the application
pnpm run build

# Start production server
pnpm run start
```

## What Was Implemented

- User registration and login with email/password
- Add, edit, and delete links with title and URL
- Toggle links active/inactive
- Public profile page with unique username slug
- Mobile-responsive design
- Drag & drop link reordering
- Click tracking and analytics
- Real-time preview in dashboard
- Social platform auto-detection (Instagram, Twitter/X, Facebook, LinkedIn, TikTok, YouTube)

## Time Breakdown

This project was completed on **2026-01-28** with the following time allocation:

### Phase 1: Project Setup & Infrastructure (1-2 hours)
- Next.js 15 project initialization
- TypeScript and ESLint configuration
- Tailwind CSS setup
- Prisma ORM and PostgreSQL connection
- NextAuth.js 5.0 beta configuration
- Database schema design and migrations
- Environment variable setup

**Commit:** `78a3500 init project`

### Phase 2: Authentication System (2-3 hours)
- User registration with email/password
- Login/logout functionality
- Password hashing with bcryptjs
- NextAuth configuration and callbacks
- Protected routes and middleware
- Auth UI components (login/register pages)

**Commits:**
- `ae0b9ea refactor(auth): restructure NextAuth configuration`

### Phase 3: Dashboard & Profile Management (3-4 hours)
- Dashboard layout and responsive design
- Profile editing (name, bio, avatar)
- Theme color customization
- Avatar upload functionality
- Mobile navigation and header
- Preview panel implementation
- Dashboard statistics cards

**Commits:**
- `e3b8846 feat(dashboard): implement responsive design and add`

### Phase 4: Link Management System (4-5 hours)
- Link CRUD operations (Create, Read, Update, Delete)
- Social platform detection and auto-icon matching
- Link validation and URL patterns
- Drag-and-drop reordering with @dnd-kit
- Toggle active/inactive status
- Link form with validation
- Click tracking implementation

**Commits:**
- `ead3fe4 refactor(core): implement centralized API service layer with custom hooks and toast notifications`

### Phase 5: Centralized API Architecture (2-3 hours)
- Service layer pattern implementation
- Custom API client with fetch wrapper
- Error handling and toast notifications
- Custom React hooks (useApi, useApiQuery)
- Type-safe API calls
- Loading and error state management
- All API endpoint implementations

**Commits:**
- `ead3fe4 refactor(core): implement centralized API service layer with custom hooks and toast notifications`

### Phase 6: Public Profile Page (2-3 hours)
- Dynamic routing with [slug]
- Profile header with avatar and bio
- Animated link display
- Click tracking integration
- Mobile-optimized layout
- Share functionality
- Responsive design testing

### Phase 7: UI Components & Polish (2-3 hours)
- Modal component with animations
- Button and input components
- Auth layout with banner
- Loading states and skeletons
- Responsive utilities
- Social platform icons (Instagram, Twitter, Facebook, etc.)
- Micro-interactions and hover effects

### Phase 8: Type Safety & Code Quality (2-3 hours)
- Enable strict TypeScript mode
- Fix all TypeScript errors
- Add Zod validation schemas
- Create comprehensive type definitions
- Enable ESLint strict mode
- Fix all linting violations
- Code refactoring for better maintainability

**Commits:**
- `a6270d5 chore: enable strict linting and fix violations`
- `6033448 refactor(types): improve type safety and component implementation`

**Breakdown by Category:**
- Core Features & Functionality: 12-16 hours
- UI/UX Design & Components: 6-8 hours
- Code Quality & Type Safety: 2-3 hours

## Live Demo

**Live Demo:** https://inktre-link-in-bio-4w5w.vercel.app

### Tip

**Avatar URL:** You can use avatar URL from services like https://vinicius73.github.io/gravatar-url-generator.
