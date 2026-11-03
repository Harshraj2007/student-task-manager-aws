# Student Task & Assignment Manager
## Cloud-Based Academic Workflow System Deployed on AWS

**Course**: Internal Assessment – III  
**Target Level**: Intermediate BTech CSE Project  
**Author**: BTech Computer Science & Engineering  
**Tech Stack**: React 18 + Vite, Java 17 + Spring Boot 3, PostgreSQL (Amazon RDS), Amazon EC2, Amazon S3, Amazon CloudFront  

---

## 1. Abstract
In higher education institutions, students face difficulty tracking multiple semester assignments, labs, and deadlines scattered across disparate portals, emails, and group chats. The **Student Task & Assignment Manager** is a full-stack, cloud-native web application designed to centralize academic deadlines, monitor task completion rates, and provide actionable priority-based schedules. The system is designed following modern cloud architectural principles, separating static frontend delivery from application business logic and utilizing a managed relational database service. The frontend is built with React and Vite and deployed via Amazon S3 and Amazon CloudFront. The backend RESTful API is built using Java 17 and Spring Boot 3, containerized and hosted on Amazon EC2, backed by Amazon RDS for PostgreSQL. This report details the system architecture, database schema, implementation specifics, testing methodologies, and deployment procedures on AWS.

---

## 2. Problem Statement
Students typically manage 5 to 7 courses per semester, each with distinct deadlines, submission formats, and weightage. Common challenges include:
1. **Missed Deadlines**: Lack of visual priority alerting leads to last-minute submissions or penalties.
2. **Scattered Tracking**: Tasks are tracked in paper planners, notes apps, or forgotten in syllabus documents.
3. **Absence of Progress Analytics**: Students lack visibility into their completion velocity and workload distribution.

The goal of this project is to build an interactive, high-availability, cloud-hosted application providing real-time tracking, dynamic filtering, analytical metrics, and persistent storage.

---

## 3. System Architecture & AWS Services

### 3.1 Cloud Architecture Overview
The system employs a 3-tier cloud architecture designed for scalability, low latency, and security:

```
[ User Browser / Client ]
           │
           │ HTTPS / CDN
           ▼
[ Amazon CloudFront (Edge Locations) ]
           │
           │ Static Asset Origin
           ▼
[ Amazon S3 Bucket ] (React SPA Production Build)
           │
           │ API Requests (/api/*)
           ▼
[ Amazon EC2 Instance ] (Spring Boot 3 REST API on Port 8080)
     ├── Nginx Reverse Proxy (SSL Termination / Port 80 & 443 -> 8080)
     └── OpenJDK 17 Runtime Environment
           │
           │ JDBC (Port 5432 - VPC Private Subnet / Security Group)
           ▼
[ Amazon RDS for PostgreSQL ] (Managed Multi-AZ Relational Database)
```

### 3.2 AWS Services Used & Justification

| AWS Service | Role in Architecture | Justification / Free Tier Fit |
|---|---|---|
| **Amazon S3** | Static Website Hosting | Low-cost, highly durable object storage for compiled React assets (HTML, CSS, JS bundles). |
| **Amazon CloudFront** | Global Content Delivery Network (CDN) | Distributes static assets globally with low latency and provides automatic SSL/TLS termination. |
| **Amazon EC2 (t2.micro / t3.micro)** | Backend Application Server | 750 hours/month under Free Tier; hosts Java Spring Boot runtime with systemd service isolation. |
| **Amazon RDS (db.t3.micro / db.t4g.micro)** | Managed PostgreSQL Database | 750 hours/month of db.t3.micro under Free Tier; automated backups, point-in-time recovery, zero maintenance. |
| **Amazon VPC & Security Groups** | Network Isolation | Restricts RDS database traffic exclusively to incoming connections originating from the EC2 security group. |
| **AWS CloudWatch** | Monitoring & Alarms | Monitors EC2 CPU utilization, network traffic, and RDS storage alarms to maintain Free Tier thresholds. |

---

## 4. Database Schema Design

### 4.1 Entity-Relationship Model
The relational schema is implemented in PostgreSQL:

#### `assignments` Table
| Column Name | Data Type | Constraints | Description |
|---|---|---|---|
| `id` | BIGINT | PRIMARY KEY, AUTO_INCREMENT | Unique identifier for assignment |
| `title` | VARCHAR(255) | NOT NULL | Title of the academic task |
| `subject` | VARCHAR(100) | NOT NULL | Course or subject name |
| `description` | TEXT | NULLABLE | Detailed instructions, references, or rubrics |
| `due_date` | DATE | NULLABLE | Target completion date |
| `priority` | VARCHAR(20) | NOT NULL, DEFAULT 'MEDIUM' | Allowed values: `LOW`, `MEDIUM`, `HIGH` |
| `status` | VARCHAR(20) | NOT NULL, DEFAULT 'PENDING' | Allowed values: `PENDING`, `IN_PROGRESS`, `COMPLETED` |
| `created_at` | TIMESTAMP | NOT NULL | Record creation timestamp |
| `updated_at` | TIMESTAMP | NOT NULL | Record last modification timestamp |

---

## 5. RESTful API Specification

The Spring Boot backend exposes clean REST endpoints adhering to standard HTTP semantics:

| HTTP Method | Endpoint | Description | Request Body | Response Code |
|---|---|---|---|---|
| `GET` | `/api/health` | Service health status | None | `200 OK` |
| `GET` | `/api/dashboard/summary` | Aggregate statistics (totals, completion %) | None | `200 OK` |
| `GET` | `/api/assignments` | List assignments (supports `?status=&priority=&subject=`) | None | `200 OK` |
| `GET` | `/api/assignments/{id}` | Retrieve specific assignment by ID | None | `200 OK` / `404 Not Found` |
| `POST` | `/api/assignments` | Create a new assignment | `AssignmentRequest` JSON | `201 Created` / `400 Bad Request` |
| `PUT` | `/api/assignments/{id}` | Update existing assignment | `AssignmentRequest` JSON | `200 OK` / `404 Not Found` |
| `DELETE` | `/api/assignments/{id}` | Remove assignment | None | `204 No Content` / `404 Not Found` |

---

## 6. AWS Deployment Execution Guide

### Phase 1: Managed Database Setup (Amazon RDS)
1. Open AWS RDS Console -> Click **Create database**.
2. Select **PostgreSQL** (version 15.x or 16.x).
3. Under Templates, choose **Free Tier**.
4. Set DB instance identifier: `student-manager-db`.
5. Master username: `postgres`; configure master password.
6. DB instance class: `db.t3.micro` or `db.t4g.micro`.
7. Connectivity: Enable **Public Access** (for initial migration) or configure EC2 Security Group inbound rule for port `5432`.
8. Save and wait for status to become `Available`. Note the **RDS Endpoint**.

### Phase 2: Application Server Deployment (Amazon EC2)
1. Launch an EC2 instance:
   - AMI: **Ubuntu 24.04 LTS** (Free tier eligible).
   - Instance Type: **t2.micro** or **t3.micro**.
   - Security Group: Allow Inbound Ports `22` (SSH), `80` (HTTP), and `8080` (Spring Boot API).
2. Connect to EC2 via SSH:
   ```bash
   ssh -i your-key.pem ubuntu@<ec2-public-ip>
   ```
3. Install OpenJDK 17 on EC2:
   ```bash
   sudo apt update && sudo apt install -y openjdk-17-jre-headless
   ```
4. Transfer and run the Spring Boot JAR:
   ```bash
   export SPRING_DATASOURCE_URL="jdbc:postgresql://<rds-endpoint>:5432/postgres"
   export SPRING_DATASOURCE_USERNAME="postgres"
   export SPRING_DATASOURCE_PASSWORD="<your-password>"
   java -jar backend-0.0.1-SNAPSHOT.jar --spring.profiles.active=prod
   ```

### Phase 3: Frontend Deployment (Amazon S3 & CloudFront)
1. Compile React production assets locally:
   ```bash
   npm run build
   ```
2. Create an Amazon S3 Bucket:
   - Bucket name: `student-task-manager-frontend-<unique-id>`.
   - Enable **Static website hosting**; index document: `index.html`.
3. Upload contents of `frontend/dist/` to the S3 bucket.
4. Create an **Amazon CloudFront** distribution pointing to the S3 bucket origin.
5. Set Default Root Object to `index.html` and configure custom error responses (HTTP 403/404 -> `/index.html` with status 200 for React client-side routing).

---

## 7. Results & Key Deliverables
1. **Interactive Dashboard**: Real-time KPI cards for pending, ongoing, and completed tasks with completion percentage calculation.
2. **Instant Search & Multi-criteria Filtering**: Client and server-side filtering by course/subject and priority level.
3. **Decoupled Architecture**: High maintainability with complete separation of concerns between UI client and API backend.
4. **AWS Cost Efficiency**: Entire architecture fits comfortably within AWS Free Tier limits ($0.00 estimated operational cost during review).
