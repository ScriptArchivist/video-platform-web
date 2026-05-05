# Web Video Platform Client

Web client for a video platform built on top of a microservice-based backend.  
Provides video management, upload workflows, and live stream playback via a modern browser UI.

---

## Description

This project is a web application for interacting with a video platform ecosystem.  
It shares the same backend APIs as the mobile client and supports:

- Video browsing and playback (HLS)
- Video upload and processing workflow
- Live stream management and viewing
- Authentication and protected routes

The application is built using Next.js with a modular feature-based architecture.

---

## Features

- Authentication (JWT-based)
- Video list with pagination and filters
- Video detail and playback (HLS via `hls.js`)
- Video creation and metadata management
- Video upload with progress tracking
- Processing status monitoring
- Live stream session management
- Active live sessions list
- Live playback by stream key
- Global error handling and form validation

---

## Tech Stack

| Category        | Technology                          |
|----------------|-------------------------------------|
| Framework      | Next.js (App Router)                |
| Language       | TypeScript                          |
| UI             | React 19 + Tailwind CSS             |
| Data Fetching  | React Query (@tanstack/react-query) |
| HTTP Client    | Axios                               |
| Forms          | React Hook Form + Zod               |
| Video Playback | hls.js                              |
| Icons          | lucide-react                        |
| Containerization | Docker                            |

---

## Architecture

Feature-based structure with separation of concerns:
src/
app/ # Next.js App Router (pages, layouts)
features/ # Domain modules (auth, videos, live, upload)
shared/ # Shared infrastructure (API, UI, utils)


### Key Modules

- `features/auth` — login and authentication logic
- `features/videos` — video CRUD and playback
- `features/upload` — upload workflow (init → upload → complete)
- `features/live` — live sessions and playback
- `shared/api` — Axios client + error handling
- `shared/ui` — layout, guards, reusable UI

---

## Routing Overview

| Route                     | Description                     |
|--------------------------|---------------------------------|
| `/login`                 | Authentication page            |
| `/videos`                | Video list                     |
| `/videos/new`            | Upload video                   |
| `/videos/[id]`           | Video detail                   |
| `/live`                  | Live studio                    |
| `/live/active`           | Active live sessions           |
| `/watch/live/[streamKey]`| Live stream playback           |
| `/profile`               | User profile                   |

---

## Getting Started

### Prerequisites

- Node.js 20+
- npm

### Install dependencies

```bash
npm install

Run in development
npm run dev

App will be available at:

http://localhost:3000
Production build
npm run build
npm run start
Docker
Build and run
docker-compose up --build

App will run on:

http://localhost:3001
Environment Variables

The application relies on external backend services.

Variable	Description
NEXT_PUBLIC_IDENTITY_API_URL	Auth service base URL
NEXT_PUBLIC_VIDEO_API_URL	Video service base URL
NEXT_PUBLIC_UPLOAD_API_URL	Upload service base URL
NEXT_PUBLIC_LIVE_API_URL	Live service base URL

Example:

NEXT_PUBLIC_IDENTITY_API_URL=/api/identity
NEXT_PUBLIC_VIDEO_API_URL=/api/video
NEXT_PUBLIC_UPLOAD_API_URL=/api/upload
NEXT_PUBLIC_LIVE_API_URL=/api/live
API Integration

The client communicates with backend services via REST APIs.

API Gateway via Next.js rewrites

All API calls are proxied through Next.js:

/api/identity/* → Identity service
/api/video/* → Video service
/api/upload/* → Upload service
/api/live/* → Live service
/origin/* → Media origin (HLS)
Authentication
JWT stored in localStorage
Automatically attached via Axios interceptor
On 401 → redirect to /login
Error Handling
Unified error parser (parseApiError)
Supports:
FastAPI validation errors
structured backend errors
field-level validation messages
Video Upload Flow
Create video metadata
Initialize upload
Upload binary file
Complete upload
Poll processing status
Playback becomes available
Live Streaming
Create live session
Receive streamKey
Stream to ingest server

Playback via HLS:

/origin/{streamKey}/index.m3u8
Supported Platforms
Chrome (latest)
Firefox (latest)
Edge (latest)
Safari (latest)
Related Projects
Backend (FastAPI microservices)
Mobile client (Flutter)
Status
Current stage: MVP / Production-ready core
Active development
Core features implemented:
video upload
playback
live streaming