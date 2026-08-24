# Pest Control Field Operations Management Platform

Production-oriented full-stack foundation for a Pest Control field operations platform.

## Stack

- Frontend: Next.js + React + TypeScript
- Backend: NestJS + TypeScript
- Database: PostgreSQL (PostGIS image)
- Cache/queue foundation: Redis
- Maps: Leaflet + OpenStreetMap
- Reporting: PDFKit + ExcelJS
- Offline/GPS: browser geolocation + batch ingestion foundation
- Storage: local uploads for trial; replace with S3/R2/MinIO for production

## Included modules

- Secure password authentication using HTTP-only session cookie
- Admin / Technician roles
- Role permissions + individual permission overrides
- Customers
- Tasks and assignments
- Attendance check-in / check-out with geofence validation
- GPS heartbeat + batch ingestion + last-seen monitoring
- Service Report form based on the attached two-page reference
- Pest findings F/M/C/R/A/O
- Service treatments
- Service photos metadata
- Service Report PDF export
- Attendance Excel export
- Audit log foundation
- Health endpoint
- File upload endpoint
- Offline/outbox architectural foundation

## Quick start with Docker

1. Install Docker Desktop.
2. Open a terminal in this repository.
3. Run:

```bash
docker compose -f docker-compose.full.yml up --build
```

4. Open `http://localhost:3000`.

### Demo accounts

Admin:

- Username: `admin`
- Password: `Admin123!`

Technician:

- Username: `technician`
- Password: `Tech123!`

API:

- `http://localhost:4000/api/v1`
- Health: `http://localhost:4000/api/v1/health`

## Local development without full Docker

Prerequisites: Node.js 22+, PostgreSQL 16+, Redis 7+.

```bash
cp .env.example .env
npm install
npm run db:generate
npm run db:migrate
npm run db:seed
npm run dev
```

Frontend: `http://localhost:3000`
Backend: `http://localhost:4000`

## Important production notes

This repository is intentionally runnable for testing, but it is not a claim that every enterprise production control is complete. Before production deployment, complete:

- Google OAuth allow-list configuration
- S3/R2/MinIO object storage
- Redis-backed queues and scheduled workers
- Real backup/restore jobs
- CSP and production reverse proxy configuration
- Strong secrets and secret manager
- CSRF strategy aligned with final auth topology
- PWA service worker + IndexedDB outbox implementation
- Native/background GPS wrapper if continuous background tracking is required
- Automated test suite and load testing
- Database migration history instead of `prisma db push`

## Service Report reference

The original reference supplied for this build is stored at:

`docs/reference/CONTOH_SERVICE_REPORT.pdf`

The PDF renderer follows its two-page information architecture: company header, client/authorized personnel, scope of area, pest table, inspection, service treatment/service area, recommendation, signatures, and a six-photo documentation page.
