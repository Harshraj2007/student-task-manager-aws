# Student Task & Assignment Manager (AWS Cloud Real-Time Project)

A production-ready full-stack academic workflow and assignment management system built with **React**, **Java Spring Boot**, and **PostgreSQL**, engineered for deployment across **Amazon Web Services (AWS)**.

---

## 🏛 Architecture Overview

- **Frontend**: React 18 + Vite SPA, Lucide Icons, clean CSS design system
  - *Cloud Hosting*: **Amazon S3** (Static bucket hosting) + **Amazon CloudFront** (Global Edge CDN & SSL)
- **Backend**: Java 17 + Spring Boot 3 REST API
  - *Cloud Hosting*: **Amazon EC2** (`t2.micro`/`t3.micro` Ubuntu 24.04 LTS instance with systemd service)
- **Database**:
  - *Local*: **H2 in-memory/embedded database** for instant, zero-setup local development
  - *Cloud*: **Amazon RDS for PostgreSQL** (`db.t3.micro` Free Tier eligible)
- **Networking & Security**: AWS VPC, Security Groups restricting RDS access strictly to EC2 backend.

---

## 📂 Project Structure

```text
student-task-manager/
├── backend/                  # Java 17 + Spring Boot 3 API
│   ├── src/main/java/        # Controllers, Services, Entities, DTOs, Repositories
│   ├── src/main/resources/   # application.properties & application-prod.properties
│   ├── pom.xml               # Maven configuration
│   └── mvnw                  # Maven Wrapper
├── frontend/                 # React 18 + Vite Client
│   ├── src/components/       # Navbar, StatsCards, AssignmentCard, AssignmentModal
│   ├── src/services/api.js   # API Client with proxy to localhost:8080
│   ├── package.json          # Vite and React dependencies
│   └── dist/                 # Production build bundle for S3
├── docs/
│   └── Project_Report.md     # Complete academic project report for Internal Assessment
└── run-local.sh              # One-command runner script for both servers
```

---

## 🚀 Running Locally

### Option 1: One-Command Startup
```bash
./run-local.sh
```

### Option 2: Running Individually

#### 1. Backend (Spring Boot):
```bash
cd backend
export JAVA_HOME="/Library/Java/JavaVirtualMachines/temurin-17.jdk/Contents/Home"
export PATH="$JAVA_HOME/bin:$PATH"
./mvnw spring-boot:run
```
- API Base: `http://localhost:8080/api`
- Health check: `http://localhost:8080/api/health`
- H2 Database Console: `http://localhost:8080/h2-console` (JDBC URL: `jdbc:h2:mem:studentdb`, Username: `sa`, Password: blank)

#### 2. Frontend (React + Vite):
```bash
cd frontend
npm run dev
```
- Open browser at `http://localhost:5173`

---

## ☁️ Deploying to AWS (Summary)

Detailed step-by-step instructions with console navigation and CLI commands are available in [`docs/Project_Report.md`](file:///Users/harshrajnago/.gemini/antigravity/scratch/student-task-manager/docs/Project_Report.md).

1. **Amazon RDS**: Create PostgreSQL instance -> note endpoint and master credentials.
2. **Amazon EC2**: Launch Ubuntu instance -> transfer `backend/target/backend-0.0.1-SNAPSHOT.jar` -> run with `--spring.profiles.active=prod` and RDS environment variables.
3. **Amazon S3 & CloudFront**: Run `npm run build` in `frontend/` -> upload `dist/` contents to S3 -> distribute via CloudFront CDN.
