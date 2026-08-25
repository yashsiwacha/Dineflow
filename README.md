# DineFlow — Premium Restaurant Operations & Customer Platform

DineFlow is an integrated digital platform designed for premium modern/North Indian restaurants. It streamlines the customer experience (menus, reservations, orders, QR-based table ordering) and connects it directly to operational modules (real-time kitchen order displays, CRM dashboards, and business analytics).

---

## Technical Architecture

The platform is designed following YES standards:
- **Backend**: Spring Boot 3.3 (Java 21) enforcing clean Hexagonal Architecture (Ports & Adapters) to isolate domain rules from frameworks.
- **Frontend**: Next.js 15 App Router (React 19 & TypeScript) implementing a premium, mobile-first design system with Tailwind CSS and real-time SSE bindings.
- **Database**: PostgreSQL (v16) with schema migrations managed via Flyway.
- **Cache & Locks**: Redis for distributed caching, session persistence, and concurrency locks.

```
┌────────────────────────────────────────────────────────┐
│                      Client Layer                      │
│       Next.js 15 (Customer, QR, Kitchen, Admin UI)     │
└──────────────────────────┬─────────────────────────────┘
                           │ HTTP REST / SSE Stream
┌──────────────────────────▼─────────────────────────────┐
│                     Backend Service                    │
│   ┌────────────────────────────────────────────────┐   │
│   │             Infrastructure Adapters            │   │
│   │   (REST Controllers, JPA Repositories, SSE)    │   │
│   │   ┌────────────────────────────────────────┐   │   │
│   │   │            Application Layer           │   │   │
│   │   │        (Use Cases, Services, locks)    │   │   │
│   │   │   ┌────────────────────────────────┐   │   │   │
│   │   │   │          Domain Core           │   │   │   │
│   │   │   │    (Pure Models, Ports, Rules) │   │   │   │
│   │   │   └────────────────────────────────┘   │   │   │
│   │   └────────────────────────────────────────┘   │   │
│   └────────────────────────────────────────────────┘   │
└──────────────────────────┬─────────────────────────────┘
             ┌─────────────┴─────────────┐
             │ SQL                       │ Key-Value
┌────────────▼─────────────┐   ┌─────────▼─────────────┐
│    PostgreSQL Database   │   │      Redis Cache      │
└──────────────────────────┘   └───────────────────────┘
```

---

## Directory Structure

```
dineflow/
├── backend/                  # Spring Boot backend app
│   ├── src/main/java/        # Java source code
│   │   └── com/dineflow/backend/
│   │       ├── domain/       # Pure models, Ports, & Exceptions (No Spring/JPA/Jackson)
│   │       ├── application/  # Service layer implementing inbound ports
│   │       ├── infrastructure/# Persistence adapters, configs, and filters
│   │       └── adapter/      # Web Controllers mapping rest inputs
│   └── src/main/resources/
│       ├── db/migration/     # Flyway SQL migrations
│       └── application.yml   # Spring configs
├── frontend/                 # Next.js 15 client dashboard
│   ├── src/app/              # Next.js App Router pages
│   ├── src/components/       # UI Primitives & composed features
│   └── src/lib/              # Cart hooks, auth hooks, api clients
└── docker-compose.yml        # Development environment services
```

---

## Local Development Setup

### Prerequisites
- Docker & Docker Compose
- Java 21 SDK
- Maven 3.9+
- Node.js v26+

### Setup Database & Cache
Initialize PostgreSQL and Redis:
```bash
docker-compose up -d
```

### Run Backend
```bash
cd backend
./mvnw spring-boot:run
```
Swagger UI will be available at: `http://localhost:8080/swagger-ui.html`

### Run Frontend
```bash
cd frontend
npm install
npm run dev
```
Client UI will be available at: `http://localhost:3000`
- Customer Portal: `http://localhost:3000/`
- Kitchen Display: `http://localhost:3000/kitchen`
- Admin Analytics: `http://localhost:3000/admin`
- QR Table 5 Order: `http://localhost:3000/table/5`
